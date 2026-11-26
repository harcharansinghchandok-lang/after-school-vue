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
    }

  }

});

app.mount("#app");