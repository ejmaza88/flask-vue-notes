// <script>window.INITIAL_DATA = JSON.parse({{initData|tojson|safe}})</script>

let NoteUrlComponent = {
  props: ["noteUrl"],
  template: "<a :href='noteUrl' target='_blank'>{{noteUrl}}</a>",
}

let DeleteNoteComponent = {
  template: "<span @click='itemClick'><small>delete</small></span>",
  methods: {
    itemClick: function () {
      this.$emit('click')
    }
  }
}

let UpdateNoteModalComponent = {
  template: "<span @click='itemClick'><small>update</small></span>",
  methods: {
    itemClick: function () {
      this.$emit('click')
    }
  }
}

let DeleteCategoryItemComponent = {
  template: "<span @click='itemClick' class='float-right'>x</span>",
  methods: {
    itemClick: function () {
      this.$emit('click')
    }
  }
}

let CategoryItemComponent = {
  props: ['category'],
  template: "<span @click='itemClick'>{{category.name}}</span>",
  methods: {
    itemClick: function () {
      this.$emit('click')
    }
  }
}

const vm = new Vue({
  el: "#vm",

  delimiters: ['[[',']]'],

  data: {
    // ...window.INITIAL_DATA,
    categories: [],
    notes: [],
    categoryModel: {"id": "", "name": ""},
    noteModel: {"id": "", "category": "", "note": "", "url": ""},
    selectedCategoryId: null,
    selectedNotes: [],
    totalSelected: 0
  },

  created: function () {
    fetch("/api/get-data/")
      .then(response => response.json())
      .then(data => {
        this.categories = data.categories;
        this.notes = data.notes;
        this.selectedCategoryId = data.categories[0].id;
        this.updateNotes()
      })
      .catch(error => {
        console.log("something went wrong: ", error);
      })
  },

  components: {
    "category-item": CategoryItemComponent,
    "delete-item": DeleteCategoryItemComponent,
    "note-url": NoteUrlComponent,
    "delete-note": DeleteNoteComponent,
    "update-note-modal": UpdateNoteModalComponent,
  },

  methods: {
    updateNotes: function (categoryId=this.categories[0].id) {
      this.selectedNotes = this.notes.filter(i => i.category === categoryId);
      this.totalSelected = this.selectedNotes.length;
    },
    viewCategoryNotes: function (e) {
      this.updateNotes(e.id)
      // this.selectedNotes = this.notes.filter(i => i.category === e.id);
      this.selectedCategoryId = e.id
    },
    addCategory: function () {
      this.categoryModel.id = this.categories.map(i => parseInt(i.id)).reduce((a, b) => a + b) + 1;
      this.categories.push(this.categoryModel)
      this.categoryModel = {"id": "", "name": ""};

    },
    deleteCategory: function (catIndex) {
      if(confirm("Delete Category?")) {
        this.categories.splice(catIndex, 1)
        this.updateNotes()
      }
    },
    addNote: function () {
      this.noteModel.id = String(this.notes.map(i => parseInt(i.id)).reduce((a, b) => a + b) + 1)
      this.noteModel.category = this.selectedCategoryId
      this.notes.push(this.noteModel)
      this.noteModel = {"category": "", "note": "", "url": ""}
      this.updateNotes(this.selectedCategoryId)
    },
    deleteNote: function (noteId) {
      if(confirm("Delete Category?")) {
        this.notes.splice(this.notes.findIndex(i => i.id === noteId), 1);
        this.updateNotes(this.selectedCategoryId);
      }
    },
    updateNote: function () {
      let noteId = $("#note_id").val();
      let noteText = $("#note_text").val();
      let noteUrl = $("#note_url").val();
      let noteToUpdate = this.notes.find(i => i.id === noteId);

      noteToUpdate.note = noteText;
      noteToUpdate.url = noteUrl;

      $("#note_modal").modal('hide');
    },
    showUpdateModal: function (noteObj) {
      $("#note_modal").modal('show');
      $("#note_id").val(noteObj.id);
      $("#note_text").val(noteObj.note);
      $("#note_url").val(noteObj.url);
    },
  }

})

