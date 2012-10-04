
$(document).ready(function() {

    window.Picture = Backbone.Model.extend({
        // id: undefined,
        // name: '',
        // path: '',
        // tags: []
    })
    
    window.PictureList = Backbone.Collection.extend({
      model: Picture,
      url: '/last5.json',
      
      parse: function(response) {
        return response.pictures
      }
    })
    
    window.Pictures = new PictureList()
    
    
    window.PictureView = Backbone.View.extend({
        tagName: 'div',
        
        className: 'pictures',
        
        template: _.template($("#picture-template").html()),

        events: {},
        
        initialize: function() {
            this.model.bind('change', this.render, this)
        },
        
        render: function() {
            
            //var dict = this.model.toJSON();
            //var html = this.template(dict);
            //$(this.el).append(html);

            this.$el.html(this.template(this.model.toJSON()))
            return this
        }
    })

    window.AppView = Backbone.View.extend({
    
        el: $('#RootView'),
        
        events: {},
        
        initialize: function() {
            
            Pictures.bind('add', this.addOne, this)
            Pictures.bind('reset', this.addAll, this)
            Pictures.bind('all', this.render, this)
            
            Pictures.fetch()
        },
        
        render: function() {},
        
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