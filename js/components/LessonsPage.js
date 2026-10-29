const LessonsPage = {
  props: {
    displayedLessons: Array,
    teachers:         Array,
    sortBy:           String,
    sortOrder:        String,
    searchText:       String,
    selectedTeacher:  [String, Number]
  },
  emits: [
    'update-sort-by',
    'update-sort-order',
    'update-selected-teacher',
    'search',       // emits the raw query string
    'add-to-cart'
  ],
  methods: {
    teacherName(lesson) {
      const t = this.teachers.find(t => t.lessonIDs.includes(lesson.id));
      return t ? t.firstName + ' ' + t.lastName : '—';
    },
    spacesClass(lesson) {
      if (lesson.space === 0) return 'spaces-none';
      if (lesson.space <= 2)  return 'spaces-low';
      return '';
    }
  },
  template: `
    <section id="lessons-page">

      <!-- ── Controls bar ── -->
      <div class="controls">
        <div class="control-group">
          <label class="control-label">Search</label>
          <input
            type="text"
            class="control-input"
            :value="searchText"
            @input="$emit('search', $event.target.value)"
            placeholder="Subject, location, price…"
          >
        </div>

        <div class="control-group">
          <label class="control-label">Teacher</label>
          <select
            class="control-input"
            :value="selectedTeacher"
            @change="$emit('update-selected-teacher', $event.target.value)"
          >
            <option value="">All teachers</option>
            <option v-for="t in teachers" :key="t.id" :value="t.id">
              {{ t.firstName }} {{ t.lastName }}
            </option>
          </select>
        </div>

        <div class="control-group">
          <label class="control-label">Sort by</label>
          <select
            class="control-input"
            :value="sortBy"
            @change="$emit('update-sort-by', $event.target.value)"
          >
            <option value="topic">Subject</option>
            <option value="location">Location</option>
            <option value="price">Price</option>
            <option value="space">Spaces</option>
          </select>
        </div>

        <div class="control-group">
          <label class="control-label">Order</label>
          <select
            class="control-input"
            :value="sortOrder"
            @change="$emit('update-sort-order', $event.target.value)"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <!-- ── Empty state ── -->
      <p class="empty-msg" v-if="displayedLessons.length === 0">
        <i class="fa-solid fa-circle-info"></i> No lessons match your search.
      </p>

      <!-- ── Lesson grid ── -->
      <div class="grid">
        <div class="card" v-for="lesson in displayedLessons" :key="lesson.id">

          <div class="card-icon-wrap">
            <i :class="lesson.icon"></i>
          </div>

          <div class="card-body">
            <h2 class="card-title">{{ lesson.topic }}</h2>

            <ul class="card-details">
              <li><i class="fa-solid fa-location-dot"></i> {{ lesson.location }}</li>
              <li><i class="fa-solid fa-sterling-sign"></i> £{{ lesson.price }}</li>
              <li><i class="fa-solid fa-chalkboard-user"></i> {{ teacherName(lesson) }}</li>
            </ul>

            <div class="card-spaces" :class="spacesClass(lesson)">
              <i class="fa-solid fa-user-group"></i>
              {{ lesson.space }} space{{ lesson.space !== 1 ? 's' : '' }} left
            </div>
          </div>

          <button
            class="btn btn-primary btn-block"
            @click="$emit('add-to-cart', lesson)"
            :disabled="lesson.space <= 0"
          >
            <i class="fa-solid fa-cart-plus"></i>
            {{ lesson.space <= 0 ? 'Sold Out' : 'Add to Cart' }}
          </button>

        </div>
      </div>
    </section>
  `
};
