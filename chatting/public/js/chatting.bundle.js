// frappe.chatting
// Author - Nihal Mittal <nihal@erpnext.com>

import {
  chattingBubble,
  chattingList,
  chattingSpace,
  chattingWelcome,
  get_settings,
  scroll_to_bottom,
} from './components';
frappe.provide('frappe.chatting');
frappe.provide('frappe.chatting.settings');

/** Spawns a chatting widget on any web page */
frappe.chatting = class {
  constructor() {
    this.setup_app();
  }

  /** Create all the required elements for chatting widget */
  create_app() {
    this.$app_element = $(document.createElement('div'));
    this.$app_element.addClass('chatting-app');
    this.$chatting_container = $(document.createElement('div'));
    this.$chatting_container.addClass('chatting-container');
    $('body').append(this.$app_element);
    this.is_open = false;

    this.$chatting_element = $(document.createElement('div'))
      .addClass('chatting-element')
      .hide();

    this.$chatting_element.append(`
			<span class="chatting-cross-button">
				${frappe.utils.icon('close', 'lg')}
			</span>
		`);
    this.$chatting_element.append(this.$chatting_container);
    this.$chatting_element.appendTo(this.$app_element);

    this.chatting_bubble = new chattingBubble(this);
    this.chatting_bubble.render();

    const navbar_icon_html = `
        <li class='nav-item dropdown dropdown-notifications 
          dropdown-mobile chatting-navbar-icon' title="Show chattings" >
          ${frappe.utils.icon('small-message', 'md')}
          <span class="badge" id="chatting-notification-count"></span>
        </li>
    `;

    if (this.is_desk === true) {
      $('header.navbar > .container > .navbar-collapse > ul').prepend(
        navbar_icon_html
      );
    }
    this.setup_events();
  }

  /** Load dependencies and fetch the settings */
  async setup_app() {
    try {
      const token = localStorage.getItem('guest_token') || '';
      const res = await get_settings(token);
      this.is_admin = res.is_admin;
      this.is_desk = 'desk' in frappe;

      if (res.enable_chatting === false || (!this.is_desk && this.is_admin)) {
        return;
      }

      this.create_app();
      await frappe.socketio.init(res.socketio_port);

      frappe.chatting.settings = {};
      frappe.chatting.settings.user = res.user_settings;
      frappe.chatting.settings.unread_count = 0;

      if (res.is_admin) {
        // If the user is admin, render everthing
        this.chatting_list = new chattingList({
          $wrapper: this.$chatting_container,
          user: res.user,
          user_email: res.user_email,
          is_admin: res.is_admin,
        });
        this.chatting_list.render();
      } else if (res.is_verified) {
        // If the token and ip address matches, directly render the chatting space
        this.chatting_space = new chattingSpace({
          $wrapper: this.$chatting_container,
          profile: {
            room_name: res.guest_title,
            room: res.room,
            is_admin: res.is_admin,
            user: res.user,
            user_email: res.user_email,
          },
        });
      } else {
        //Render the welcome screen if the user is not verified
        this.chatting_welcome = new chattingWelcome({
          $wrapper: this.$chatting_container,
          profile: {
            name: res.guest_title,
            is_admin: res.is_admin,
            chatting_status: res.chatting_status,
          },
        });
        this.chatting_welcome.render();
      }
    } catch (error) {
      console.error(error);
    }
  }

  /** Shows the chatting widget */
  show_chatting_widget() {
    this.is_open = true;
    this.$chatting_element.fadeIn(250);
    if (typeof this.chatting_space !== 'undefined') {
      scroll_to_bottom(this.chatting_space.$chatting_space_container);
    }
  }

  /** Hides the chatting widget */
  hide_chatting_widget() {
    this.is_open = false;
    this.$chatting_element.fadeOut(300);
  }

  should_close(e) {
    const chatting_app = $('.chatting-app');
    const navbar = $('.navbar');
    const modal = $('.modal');
    return (
      !chatting_app.is(e.target) &&
      chatting_app.has(e.target).length === 0 &&
      !navbar.is(e.target) &&
      navbar.has(e.target).length === 0 &&
      !modal.is(e.target) &&
      modal.has(e.target).length === 0
    );
  }

  setup_events() {
    const me = this;
    $('.chatting-navbar-icon').on('click', function () {
      me.chatting_bubble.change_bubble();
    });

    $(document).mouseup(function (e) {
      if (me.should_close(e) && me.is_open === true) {
        me.chatting_bubble.change_bubble();
      }
    });
  }
};

$(function () {
  new frappe.chatting();
});
