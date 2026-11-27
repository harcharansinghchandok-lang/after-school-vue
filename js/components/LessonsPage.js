const LessonsPage = {
  props: ['lessons', 'allLessons', 'teachers', 'sortBy', 'sortOrder', 'searchText', 'selectedTeacher'],
  emits: ['add', 'search', 'update-teacher', 'update-sort-by', 'update-sort-order'],

  data() {
    return { selectedLocation: "" };
  },

  computed: {
    // all different locations for the dropdown
    locations() {
      return [...new Set(this.allLessons.map(l => l.location))].sort();
    },
    // lessons after the location filter
    visibleLessons() {
      if (this.selectedLocation === "") return this.lessons;
      return this.lessons.filter(l => l.location === this.selectedLocation);
    }
  },

  methods: {
    teacherName(lesson) {
      const t = this.teachers.find(t => t.lessonIDs.includes(lesson.id));
      return t ? t.firstName + " " + t.lastName : "To be announced";
    },
    spacesClass(lesson) {
      if (lesson.space <= 0) return "none";
      if (lesson.space <= 2) return "low";
      return "ok";
    },
    theme(lesson) {
      return "theme-" + (lesson.id % 6);
    },
    scrollToClasses() {
      document.getElementById("classes").scrollIntoView({ behavior: "smooth" });
    }
  },

  template: `
    <div>
      <!-- Hero banner -->
      <section class="hero" id="home">
        <div>
         <h1>Play. Learn.<br><span>Grow Together.</span></h1>
<p>From Maths to Music, find the perfect after school class for your child.</p>
<button class="hero-btn" @click="scrollToClasses">Start Exploring <i class="fa-solid fa-arrow-right"></i></button>
        </div>
        <div class="hero-art">
          <i class="fa-solid fa-book-open books"></i>
          <i class="fa-solid fa-lightbulb bulb"></i>
          <i class="fa-solid fa-graduation-cap grad"></i>
        </div>
      </section>

      <!-- Filters -->
      <section class="filters" id="classes">
        <label>Search
          <input type="text" :value="searchText" placeholder="Search for a subject, location or price..."
                 @input="$emit('search', $event.target.value)">
        </label>

        <label>Teacher
          <select :value="selectedTeacher" @change="$emit('update-teacher', $event.target.value)">
            <option value="">All Teachers</option>
            <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.firstName }} {{ t.lastName }}</option>
          </select>
        </label>

        <label>Location
          <select v-model="selectedLocation">
            <option value="">All Locations</option>
            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </label>

        <label>Sort by
          <select :value="sortBy" @change="$emit('update-sort-by', $event.target.value)">
            <option value="topic">Subject</option>
            <option value="location">Location</option>
            <option value="price">Price</option>
            <option value="space">Spaces</option>
          </select>
        </label>

        <label>Order
          <select :value="sortOrder" @change="$emit('update-sort-order', $event.target.value)">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </section>

      <p class="empty" v-if="visibleLessons.length === 0">No lessons found.</p>

      <!-- Lessons list (v-for) -->
      <section class="grid">
        <div class="card" v-for="lesson in visibleLessons" :key="lesson.id">
          <div class="card-banner" :class="theme(lesson)">
            <i :class="lesson.icon"></i>
          </div>
          <div class="card-body">
            <h3>{{ lesson.topic }}</h3>
            <div class="row"><i class="fa-solid fa-location-dot"></i> {{ lesson.location }}</div>
            <div class="row"><i class="fa-solid fa-sterling-sign"></i> £{{ lesson.price }}</div>
            <div class="row"><i class="fa-solid fa-user"></i> {{ teacherName(lesson) }}</div>

            <span class="pill" :class="spacesClass(lesson)">
              <i class="fa-solid fa-users"></i> {{ lesson.space }} spaces left
            </span>

            <button class="add-btn" @click="$emit('add', lesson)" :disabled="lesson.space <= 0">
              <i class="fa-solid fa-cart-shopping"></i>Add to Cart
            </button>
          </div>
        </div>
      </section>

      <!-- About + Contact -->
      <section class="info-grid">
        <div class="info-box" id="about">
          <h2><i class="fa-solid fa-circle-info"></i> About</h2>
          <p>We run friendly after school classes for children and teenagers, from Maths and Science to Art, Music and Sport.</p>
          <p>Every class is small (only 5 spaces), so each learner gets real attention from an experienced teacher.</p>
        </div>
        <div class="info-box" id="contact">
          <h2><i class="fa-solid fa-phone"></i> Contact</h2>
          <p><i class="fa-solid fa-envelope"></i> hello@afterschoolclasses.example</p>
          <p><i class="fa-solid fa-phone"></i> 020 0000 0000</p>
          <p><i class="fa-solid fa-clock"></i> Mon - Fri, 3:30pm - 6:30pm</p>
        </div>
      </section>
    </div>
  `
};
