
$(document).ready(function() {

    window.Picture = Backbone.Model.extend({
        // id: undefined,
        // name: '',
        // path: '',
        // tags: []
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
            console.log('calling render() on pictureview')
            this.$el.html(this.template(this.model.toJSON()))
            return this
        },
        
        filterTag: function(item) {
            console.log($(item.target).html())
        },
        
        removeTag: function(item) {
            $(item.target).remove()
            //console.log(this.model.toJSON())
            tmptags = []
            _.each($(item).find('li'), function(item) {
                tmptags.append(item.innerHTML) 
            })
            console.log(tmptags)
            //this.model.set({'tags': tmptags})
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
            
            Pictures.fetch()
        },
        
        render: function() {
            console.log('calling render() on appview')
        },
        
        addOne: function(picture) {
            var view = new PictureView({model: picture})
            this.$('#pictures').append(view.render().el)
        },
        
        addAll: function() {
            Pictures.each(this.addOne)
        }
    
    })
    
    var App = new AppView()
});