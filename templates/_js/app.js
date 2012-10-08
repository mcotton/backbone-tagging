
$(document).ready(function() {

    window.Picture = Backbone.Model.extend({
        // id: undefined,
        // name: '',
        // path: '',
        // tags: []
        
        hasTag: function(tag) {
            var tags = this.get('tags')
            for(var i=0; i<tags.length; i++) {
                if(tags[i] == tag) { 
                  return true
                }
            }
            return false  
        }
        
    })
    
    window.PictureList = Backbone.Collection.extend({
      model: Picture,
      url: '/pictures',
      
      parse: function(response) {
        return response.pictures
      }
    })
    
    window.Pictures = new PictureList()
    
    
    window.PictureView = Backbone.View.extend({
        tagName: 'div',
        
        className: 'pictures',
        
        template: _.template($("#picture-template").html()),

        events: {
            'click .tags li': 'filterTag',
            'click img': 'addTag' 
        },
        
        initialize: function() {
            this.model.bind('change', this.render, this)
            this.on('add_a_tag', this.render, this)
        },
        
        render: function() {
            this.$el.html(this.template(this.model.toJSON()))
            return this
        },
        
        filterTag: function(item) {
            var filterWord = $(item.target).html()
            var lstModels = _.filter(this.model.collection.models, function(tag) {
              return tag.hasTag(filterWord)
            })
            Path.navigate("tag/" + filterWord, {trigger: true, replace: true});
        },
        
        removeTag: function(item) {
            $(item.target).remove()
            tmptags = []
            _.each($(item).find('li'), function(item) {
                tmptags.append(item.innerHTML) 
            })
        },
            
        addTag: function() {
            var str = prompt('Add a tag: ')
            tags = this.model.get('tags')
            tags.push(str)
            this.model.set({tags: tags})
            Backbone.sync('update', this.model)
            this.trigger('add_a_tag')
        }
    })

    window.AppView = Backbone.View.extend({
        
        events: {},
        
        initialize: function() {
                        
            Pictures.bind('add', this.addOne, this)
            Pictures.bind('reset', this.addAll, this)
            Pictures.bind('all', this.render, this)
            Pictures.bind('filter', this.filterTags, this)
            
            Pictures.fetch()
            
        },
        
        render: function() {
        },
        
        addOne: function(picture) {
            var view = new PictureView({model: picture})
            this.$('#pictures').append(view.render().el)
        },
        
        addAll: function() {
            Pictures.each(this.addOne)
        },
        
        filterTags: function(items) {
            $('#pictures').empty()
            _.each(items, this.addOne)
        }
    
    })
    
    window.Paths = Backbone.Router.extend({
    
        initialize: function() {
            
        },
        
        routes: {
            'tag/:word': 'filterTag'
        },
        
        filterTag: function(word) {
            window.filteredModels = _.filter(Pictures.models, function(tag) {
              return tag.hasTag(word)
            })
            Pictures.trigger('filter', filteredModels)
                    
        }
        
        
    })
    
    window.Path = new Paths()
    
    
    var App = new AppView()
    Backbone.history.start({pushState: true})
});