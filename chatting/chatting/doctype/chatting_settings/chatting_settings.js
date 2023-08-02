// Copyright (c) 2023, Harleen and contributors
// For license information, please see license.txt

frappe.ui.form.on('Chatting Settings', {
  after_save: function (frm) {
    $('.chatting-app').remove();
    $('.chatting-navbar-icon').remove();
    if (frm.doc.enable_chat) {
      new frappe.Chatting();
    }
  },
});

