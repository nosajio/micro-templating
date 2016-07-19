/**
 * @name Micro Templating
 * @desc Will inject a object into a jquery html element.
 * @depends jQuery
 * @example
 *   HTML =>
 *     <div class="project">
 *       <h1 data-template-part="title"></h1>
 *       <img data-template-part="images.large" data-template-attr="src">
 *     </div>
 *
 *   JS =>
 *     $el = $('[data-template]');
 *     var dataObj = {
 *       images: {
 *         small: 'http://image.url',
 *         large: 'http://image.url',
 *       },
 *       title: 'A title',
 *     };
 *
 *     micro.inject($el, dataObj);
 */

(function($) {
  'use strict';

  this.micro = uiMutators();

  function uiMutators() {
    return {
      inject: injectTemplateContent,
    };

    /**
     * @name Inject Template Content
     * @desc A helper for injecting content from a json object into a html template.
     * This helper uses an attribute name convention to map json properties with
     * html elements (see example).
     * @param {HTMLElement} $template
     * @param {Object} content
     * @returns {HTMLElement} same template with content added
     */
    function injectTemplateContent($template, content) {
      var properties = Object.keys(content);
      var flatContent = {};
      var repeatableContent = {};

      // map properties into a flat list before running replacement
      properties.forEach(function (prop) {
        mapProperty(prop, content[prop]);
      });
      var repeatableProperties = Object.keys(repeatableContent);
      var flatProperties = Object.keys(flatContent);
      flatProperties.forEach(replaceInTemplate);
      repeatableProperties.forEach(repeatInTemplate);

      return $template;

      function mapProperty(prop, content) {
        var surrogateProp;
        switch ($.type(content)) {
          case 'object':
            var objProps = Object.keys(content);
            objProps.forEach(function(nestedProp) {
              var mapName = prop +'.'+ nestedProp;
              mapProperty(mapName, content[nestedProp]);
            });
            break;
          case 'string':
            surrogateProp = prop;
            flatContent[surrogateProp] = content;
            break;
          case 'array':
            surrogateProp = prop;
            repeatableContent[surrogateProp] = content;
            break;
        }
      }

      function repeatInTemplate(prop) {
        var contentArray = repeatableContent[prop];
        var $found = $($template).find('[data-repeat*="'+ prop +'"]');
        var loopEls = [];
        if (! $found.length) return /* no el's found, move onto the next prop */;
        contentArray.forEach(function (it) {
          // Run the parent method -- this makes nesting possible
          var $scopedContent = injectTemplateContent($found.clone(), it);
          loopEls.push($scopedContent);
        });
        console.log(loopEls);
        if (loopEls.length) {
          $($template)
            .find('[data-repeat*="'+ prop +'"]')
            .replaceWith(loopEls);
        }
      }

      function replaceInTemplate(prop) {
        var contentItem = flatContent[prop];
        var $found = $($template).find('[data-template-part*="'+ prop +'"]');
        var attr = $found.attr('data-template-attr');
        if (! $found.length) return /* no el's found, move onto the next prop */;
        if (attr) {
          $found.attr(attr, contentItem);
        } else {
          $found.html(contentItem);
        }
      }
    }
  }
}.call(window, jQuery));
