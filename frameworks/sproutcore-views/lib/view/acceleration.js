// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

require("sproutcore-views/view");
require("sproutcore-views/view/layout");
require("sproutcore-views/view/layout_style");

SC.View.reopen({

  /**
    Setting wantsAcceleratedLayer to YES will use transforms to move the
    layer when available. On some platforms transforms are hardware accelerated.
  */
  wantsAcceleratedLayer: NO,

  /**
    Specifies whether transforms can be used to move the layer.
  */
  hasAcceleratedLayer: function () {
    return (this.platform.supportsCSSTransforms && this.get('wantsAcceleratedLayer') && this.get('isFixedLayout'));
  }.property('wantsAcceleratedLayer', 'isFixedLayout').cacheable()

});
