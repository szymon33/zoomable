(function() {
  if ($('textarea.txt-zoomable').length === 0) { return null; }

  var webDevBreak = { keyCodes: { ESCAPE: 27 } };

  webDevBreak.enhanceZoomMode = function () {
    var activate = function () {
      $('textarea.txt-zoomable').each(function() {
        var target_id = "zoom-toggle-" + $(this).prop("id");
        var $checkbox = $('<input  id="' + target_id + '" type="checkbox" tabindex="-1">');
        var $expander = $('<label for="' + target_id + '" class="zoom-label expander"></label>');
        var $shrinker = $('<label for="' + target_id + '" class="zoom-label shrinker"></label>');

        var $container = $(this).closest('.form-group');
        $container.addClass('zoomable');
        $container.prepend($checkbox);
        $(this).before($expander);
        $(this).before($shrinker);

        $(this).parent().addClass('zoom-backdrop');

        updateZoomModeFromLocationHash();
      });
    };

    var locationHashPrefix = 'expand_';
    var model = { activeZoomWidget: null };

    var updateActiveZoomWidget = function (checkboxForActiveZoomWidget) {

      var $checkbox = $(checkboxForActiveZoomWidget);
      $checkbox.prop("checked", true);

      model.activeZoomWidget = {
        checkbox: $checkbox,
        textarea: $checkbox.parent().find("textarea")
      };

      model.activeZoomWidget.textarea.focus();
      window.location.hash = locationHashPrefix + $checkbox.prop("id");
    };

    var exitZoomMode = function () {
      if (model.activeZoomWidget !== null) {
        model.activeZoomWidget.checkbox.prop("checked", false);
        model.activeZoomWidget.textarea.focus();
        model.activeZoomWidget = null;
        window.location.hash = '';
      }
    };

    var watchCheckboxChangesAndUpdateZoomMode = function () {

      $("body").on("change", ".zoomable input[type=checkbox]", function (event) {
        var changedCheckbox = event.currentTarget;
        if (changedCheckbox.checked) {
          updateActiveZoomWidget(changedCheckbox);
        } else {
          exitZoomMode();
        }
      });

    };

    var watchEscapeKeyAndExitZoomMode = function () {
      $(document).keydown(function (event) {
        if (event.keyCode == webDevBreak.keyCodes.ESCAPE) {
          exitZoomMode();
        }
      });
    };

    var getCheckboxFromLocationHash = function () {
      var checkboxId = $.trim(
              window.location.hash.replace('#' + locationHashPrefix, '')
      );
      var checkbox = null;
      if (checkboxId) {
        checkbox = $(".zoomable input[type=checkbox]#" + checkboxId)[0];
      }
      return checkbox;
    };

    var updateZoomModeFromLocationHash = function () {
      var checkbox = getCheckboxFromLocationHash();
      if (checkbox) {
        updateActiveZoomWidget(checkbox);
      } else {
        exitZoomMode();
      }
    };

    var watchLocationHashAndUpdateZoomMode = function () {
      $(window).on("hashchange", updateZoomModeFromLocationHash);
    };

    activate();
    watchCheckboxChangesAndUpdateZoomMode();
    watchEscapeKeyAndExitZoomMode();
    watchLocationHashAndUpdateZoomMode();

  };

  $(document).ready(webDevBreak.enhanceZoomMode);
}());
