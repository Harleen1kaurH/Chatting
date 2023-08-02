frappe.listview_settings['Chatting Message'] = {
  filters: [['sender_email', '=', frappe.session.user]],
};
