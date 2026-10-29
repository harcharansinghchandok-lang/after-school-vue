const app = Vue.createApp({

  components: {
    'app-header':    AppHeader,
    'lessons-page':  LessonsPage,
    'cart-page':     CartPage
  },

  data() {
    return {
      sitename:        "After School Classes",
      lessons:         [],
      teachers:        [],
      cart:            [],      // one lesson id per space booked
      showCart:        false,
      sortBy:          "topic",
      sortOrder:       "asc",
      searchText:      "",
      searchIds:       null,    // null = no search filter active
      selectedTeacher: "",      // "" = all teachers
      name:            "",
      phone:           "",
      orderMessage:    "",
      statusMessage:   ""
    };
  },

  created() {
    this.loadLessons();
    this.loadTeachers();
  },

  // ── Computed ──────────────────────────────────────────────────────────────
  computed: {

    // Lessons after teacher filter + search + sorting
    displayedLessons() {
      const teacherIds = this.selectedTeacherLessonIds;

      const list = this.lessons.filter(l => {
        const okTeacher = teacherIds === null || teacherIds.includes(l.id);
        const okSearch  = this.searchIds === null || this.searchIds.includes(l.id);
        return okTeacher && okSearch;
      });

      const key = this.sortBy;
      const dir = this.sortOrder === "asc" ? 1 : -1;

      return list.sort((a, b) =>
        typeof a[key] === "string"
          ? a[key].localeCompare(b[key]) * dir
          : (a[key] - b[key]) * dir
      );
    },

    // Lesson ids taught by the selected teacher (null = no filter)
    selectedTeacherLessonIds() {
      if (this.selectedTeacher === "") return null;
      const tid = Number(this.selectedTeacher);
      const teacher = this.teachers.find(t => t.id === tid);
      return teacher ? teacher.lessonIDs : [];
    },

    // Cart grouped by lesson with quantities
    cartItems() {
      const items = [];
      this.cart.forEach(id => {
        const existing = items.find(i => i.lesson.id === id);
        if (existing) {
          existing.quantity++;
        } else {
          const lesson = this.lessons.find(l => l.id === id);
          if (lesson) items.push({ lesson, quantity: 1 });
        }
      });
      return items;
    },

    totalPrice() {
      return this.cartItems.reduce((sum, i) => sum + i.lesson.price * i.quantity, 0);
    },

    // Validation (regular expressions)
    nameValid()    { return /^[A-Za-z]+( [A-Za-z]+)*$/.test(this.name.trim()); },
    phoneValid()   { return /^[0-9]+$/.test(this.phone); },
    canCheckout()  { return this.nameValid && this.phoneValid && this.cart.length > 0; }
  },

  // ── Methods ───────────────────────────────────────────────────────────────
  methods: {

    // FETCH 1 – GET all lessons
    loadLessons() {
      fetch(API_URL + "/lessons")
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(data => { this.lessons = data; })
        .catch(() => {
          this.lessons = sampleLessons.map(l => ({ ...l }));
          this.statusMessage = "Server not reachable — showing sample data (demo mode).";
        });
    },

    // GET all teachers
    loadTeachers() {
      fetch(API_URL + "/teachers")
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(data => { this.teachers = data; })
        .catch(() => { this.teachers = sampleTeachers; });
    },

    // Back-end search; falls back to local filter if server unreachable
    handleSearch(q) {
      this.searchText = q;
      const trimmed = q.trim();

      if (trimmed === "") {
        this.searchIds = null;
        return;
      }

      fetch(API_URL + "/search?q=" + encodeURIComponent(trimmed))
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(results => { this.searchIds = results.map(l => l.id); })
        .catch(() => {
          const t = trimmed.toLowerCase();
          this.searchIds = this.lessons
            .filter(l =>
              l.topic.toLowerCase().includes(t) ||
              l.location.toLowerCase().includes(t) ||
              String(l.price).includes(t) ||
              String(l.space).includes(t))
            .map(l => l.id);
        });
    },

    // Cart operations
    addToCart(lesson) {
      if (lesson.space > 0) {
        lesson.space--;
        this.cart.push(lesson.id);
      }
    },

    removeFromCart(id) {
      const index = this.cart.indexOf(id);
      if (index !== -1) {
        this.cart.splice(index, 1);
        const lesson = this.lessons.find(l => l.id === id);
        if (lesson) lesson.space++;
      }
      if (this.cart.length === 0) this.showCart = false;
    },

    toggleCart() {
      this.showCart = !this.showCart;
      this.orderMessage = "";
    },

    // FETCH 2 (POST order) → FETCH 3 (PUT spaces)
    checkout() {
      const customerName = this.name.trim();
      const items = this.cartItems.map(i => ({
        lessonID: i.lesson.id,
        spaces:   i.quantity
      }));
      const order = {
        name:      customerName,
        phone:     this.phone,
        lessonIDs: items.map(i => i.lessonID),
        spaces:    this.cart.length,
        items
      };
      const updates = this.cartItems.map(i => ({
        id:    i.lesson.id,
        space: i.lesson.space
      }));

      fetch(API_URL + "/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(order)
      })
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(() =>
          Promise.all(updates.map(u =>
            fetch(API_URL + "/lessons/" + u.id, {
              method:  "PUT",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({ space: u.space })
            })
          ))
        )
        .then(() => this.finishOrder(customerName, true))
        .catch(()  => this.finishOrder(customerName, false));
    },

    finishOrder(name, saved) {
      this.orderMessage = saved
        ? "Thank you, " + name + "! Your order has been placed successfully."
        : "Order recorded for " + name + " (demo mode — server not reachable).";
      this.cart  = [];
      this.name  = "";
      this.phone = "";
    }
  }

});

app.mount("#app");
