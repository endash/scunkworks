require("sproutcore-views/view");

SC.View.reopen(
  /** @scope SC.View.prototype */{

  /**
    This code exists to make it possible to pool SC.Views.
    */
  _lastLayerId: null,

  /** @private */
  init: function () {
    this._super();

    // Set up the cached layerId if it has been set on create.
    this._lastLayerId = this.get('layerId');
  },

  /**
    Handles changes in the layer id.
  */
  layerIdDidChange: function() {
    var layer  = this.get('layer'),
        lid    = this.get('layerId'),
        lastId = this._lastLayerId;

    if (lid !== lastId) {
      // if we had an earlier one, remove from view hash.
      if (lastId && SC.View.views[lastId] === this) {
        delete SC.View.views[lastId];
      }

      // set the current one as the new old one
      this._lastLayerId = lid;

      // and add the new one
      SC.View.views[lid] = this;

      // and finally, set the actual layer id.
      if (layer) { layer.id = lid; }
    }
  }.observes("layerId"),

  // ------------------------------------------------------------------------
  // LAYER LOCATION
  //

  /**
    Insert the view into the the receiver's childNodes array.

    The view will be added to the childNodes array before the beforeView.  If
    beforeView is null, then the view will be added to the end of the array.
    This will also add the view's rootElement DOM node to the receivers
    containerElement DOM node as a child.

    If the specified view already belongs to another parent, it will be
    removed from that view first.

    @param {SC.View} view
    @param {SC.View} beforeView
    @returns {SC.View} the receiver
  */
  insertBefore: function(view, beforeView) {
    Ember.changeProperties(function () {
      // Reset any views that are already building in or out.
      if (view.resetBuildState) { view.resetBuildState(); }
      view._doAdopt(this, beforeView);
    }, this);

    // Make sure all notifications are delayed since the appending
    // doesn't complete until the end of the RunLoop
    // There may be better ways to do this than with invokeLast,
    // but it's the best I can do for now - PDW
    // this.invokeLast(function () {
    //   var pane = view.get('pane');
    //   if (pane && pane.get('isPaneAttached')) {
    //     view._notifyDidAppendToDocument();
    //   }
    // });

    return this ;
  },

  removeChild: function(view) {
    if (!view) { return this; } // nothing to do
    if (view.parentView !== this) {
      throw new Error("%@.removeChild(%@) must belong to parent".fmt(this, view));
    }

    // notify views
    // TODO: Deprecate these notifications.
    if (view.willRemoveFromParent) { view.willRemoveFromParent() ; }
    if (this.willRemoveChild) { this.willRemoveChild(view) ; }

    this._super(view);

    return this;
  },

  /**
    Replace the oldView with the specified view in the receivers childNodes
    array. This will also replace the DOM node of the oldView with the DOM
    node of the new view in the receivers DOM.

    If the specified view already belongs to another parent, it will be
    removed from that view first.

    @param view {SC.View} the view to insert in the DOM
    @param view {SC.View} the view to remove from the DOM.
    @returns {SC.View} the receiver
  */
  replaceChild: function(view, oldView) {
    Ember.changeProperties(function () {
      this.insertBefore(view,oldView).removeChild(oldView) ;
    }, this);

    return this;
  },

  /**
    Replaces the current array of child views with the new array of child
    views.

    This will remove *and* destroy all of the existing child views and their
    layers.

    Warning: The new array must be made of *child* views (i.e. created using
    this.createChildView() on the parent).

    @param {Array} newChildViews Child views you want to add
    @returns {SC.View} receiver
  */
  replaceAllChildren: function (newChildViews) {

    // If rendered, destroy our layer so we can re-render.
    // if (this.get('_isRendered')) {
    //   var layer = this.get('layer');

    //   // If attached, detach and track our parent node so we can re-attach.
    //   if (this.get('isAttached')) {
    //     // We don't allow for transitioning out at this time.
    //     // TODO: support transition out of child views.
    //     this._doDetach(true);
    //   }

    //   // Destroy our layer in one move.
    //   this.destroyLayer();
    // }

    // Remove the current child views.
    // We aren't rendered at this point so it bypasses the optimization in
    // removeAllChildren that would recreate the layer.  We would rather add the
    // new childViews before recreating the layer.
    Ember.changeProperties(function () {
      this.removeAllChildren(true);

      // Add the new children.
      for (var i = 0, len = newChildViews.get('length'); i < len; i++) {
        this.appendChild(newChildViews.objectAt(i));
      }
    }, this);
    // We were rendered previously.
    // if (layer) {
    //   // Recreate our layer (now empty).
    //   this.createLayer();
    // }

    return this ;
  },

  /**
    Appends the specified view to the end of the receivers childViews array.
    This is equivalent to calling insertBefore(view, null);

    @param view {SC.View} the view to insert
    @returns {SC.View} the receiver
  */
  appendChild: function(view) {
    return this.insertBefore(view, null);
  }
});
