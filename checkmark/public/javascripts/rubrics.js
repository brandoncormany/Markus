function load_levels(id) {
    $('selected_criterion_name').update($F('criterion_inputs_'+id+'_name'));
    new Ajax.Request('/checkmark/rubrics/list_levels/1', {asynchronous:true, evalScripts:true,parameters: {'criterion_id':id,'authenticity_token': encodeURIComponent(authenticity_token)}});
}

function focus_criterion(id) {
    if(selected_criterion_id != null) {
        hide_criterion(selected_criterion_id);
    }
    show_criterion(id);
    selected_criterion_id = id;
}
function hide_criterion(id) {
    $('criterion_inputs_'+id).hide();
    $('criterion_title_'+id).show();
    $('criterion_'+id).removeClassName('criterion_holder_selected');
}

function show_criterion(id) {
    $('criterion_inputs_'+id).show();
    $('criterion_title_'+id).hide();
    $('criterion_'+id).addClassName('criterion_holder_selected');
}

function criterion_weight_bump(amount, input, criterion_id) {
    var weight = parseFloat($F(input));
    if (weight + amount > 0) {
        weight += amount;
        $(input).value = weight;
    }
    criterion_input_edited('weight', input, criterion_id);
    //TODO:  Update title_div weight display for this criterion
}

function level_input_edited(input_type, input, level_id) {
  $(input).disable();
  new Ajax.Request('/checkmark/rubrics/update_level/1', {
      asynchronous:true, 
      evalScripts:true, 
      onSuccess:function(request){
          data = request.responseText.evalJSON();
          if(data.status == 'OK') {
              $(input).enable();
              //Update the title_div name and description, in case these have been changed
          }
          else if(data.status == 'error') {
              //TODO:  Visually alert user that update did not take place
              $(input).value = data.old_value;
              $(input).enable();
          }
      }, 
      onFailure: function(request) {
           alert('Server communications failure:  this value was not updated.');
           $(input).disable();
      },
      parameters: {'level_id': level_id, 'update_type': input_type, 'new_value': $F(input), 'authenticity_token':  encodeURIComponent(authenticity_token)}
   }
 );
}

function criterion_input_edited(input_type, input, criterion_id) {
  $(input).disable();
  new Ajax.Request('/checkmark/rubrics/update_criterion/1', {
      asynchronous:true, 
      evalScripts:true, 
      onSuccess:function(request){
          data = request.responseText.evalJSON();
          if(data.status == 'OK') {
              $(input).enable();
              //Update the title_div name and description, in case these have been changed
              if(input_type == 'name') {
                  $('criterion_title_'+criterion_id+'_name').update($F(input));
              }
              else if(input_type == 'weight') {
                  $('criterion_title_'+criterion_id+'_weight').update($F(input));
              }
          }
          else if(data.status == 'error') {
              //TODO:  Visually alert user that update did not take place
              $(input).value = data.old_value;
              $(input).enable();
          }
      }, 
      onFailure: function(request) {
           alert('Server communications failure:  this value was not updated.');
           $(input).disable();
      },
      parameters: {'criterion_id': criterion_id, 'update_type': input_type, 'new_value': $F(input), 'authenticity_token':  encodeURIComponent(authenticity_token)}
   }
 );
    
}
document.observe('dom:loaded', function() {
var tab_menu = new Control.Tabs('rubric_tabs');
tab_menu.setActiveTab('manually_edit_rubric_canvas');
});
