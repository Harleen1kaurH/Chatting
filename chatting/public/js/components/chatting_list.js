import chattingRoom from './chatting_room';
import chattingAddRoom from './chatting_add_room';
import chattingUserSettings from './chatting_user_settings';
import { get_rooms, mark_message_read } from './chatting_utils';

export default class chattingList {
  constructor(opts) {
    this.$wrapper = opts.$wrapper;
    this.user = opts.user;
    this.user_email = opts.user_email;
    this.is_admin = opts.is_admin;
    this.setup();
  }

  setup() {
    this.$chatting_list = $(document.createElement('div'));
    this.$chatting_list.addClass('chatting-list');
    this.setup_header();
    this.setup_search();
    this.fetch_and_setup_rooms();
    this.setup_socketio();
  }

  setup_header() {
    const chatting_list_header_html = `
			<div class='chatting-list-header'>
				<h3>${__('chattings')}</h3>
        <div class='chatting-list-icons'>
          <div class='add-room' 
            title='Create Private Room'>
            ${frappe.utils.icon('users', 'md')}
          </div>
          <div class='user-settings' 
          title='Settings'>
          ${frappe.utils.icon('setting-gear', 'md')}
          </div>
        </div>
			</div>
		`;
    this.$chatting_list.append(chatting_list_header_html);
  }

  setup_search() {
    const chatting_list_search_html = `
		<div class='chatting-search'>
			<div class='input-group'>
				<input class='form-control chatting-search-box'
				type='search' 
				placeholder='${__('Search conversation')}'
				>	
				<span class='search-icon'>
					${frappe.utils.icon('search', 'sm')}
				</span>
			</div>
		</div>
		`;
    this.$chatting_list.append(chatting_list_search_html);
  }

  async fetch_and_setup_rooms() {
    try {
      const res = await get_rooms(this.user_email);
      this.rooms = res;
      this.setup_rooms();
      this.render_messages();
    } catch (error) {
      frappe.msgprint({
        title: __('Error'),
        message: __('Something went wrong. Please refresh and try again.'),
      });
    }
  }

  setup_rooms() {
    this.$chatting_rooms_container = $(document.createElement('div'));
    this.$chatting_rooms_container.addClass('chatting-rooms-container');
    this.chatting_rooms = [];

    this.rooms.forEach((element) => {
      let profile = {
        user: this.user,
        user_email: this.user_email,
        last_message: element.last_message,
        last_date: element.modified,
        is_admin: this.is_admin,
        room: element.name,
        is_read: element.is_read,
        room_name: element.room_name,
        room_type: element.type,
        opposite_person_email: element.opposite_person_email,
      };

      this.chatting_rooms.push([
        profile.room,
        new chattingRoom({
          $wrapper: this.$wrapper,
          $chatting_rooms_container: this.$chatting_rooms_container,
          chatting_list: this,
          element: profile,
        }),
      ]);
    });
    this.$chatting_list.append(this.$chatting_rooms_container);
  }

  fitler_rooms(query) {
    for (const room of this.chatting_rooms) {
      const txt = room[1].profile.room_name.toLowerCase();
      if (txt.includes(query)) {
        room[1].$chatting_room.show();
      } else {
        room[1].$chatting_room.hide();
      }
    }
  }

  create_new_room(profile) {
    this.chatting_rooms.unshift([
      profile.room,
      new chattingRoom({
        $wrapper: this.$wrapper,
        $chatting_rooms_container: this.$chatting_rooms_container,
        chatting_list: this,
        element: profile,
      }),
    ]);
    this.chatting_rooms[0][1].render('prepend');
  }

  setup_events() {
    const me = this;
    $('.chatting-search-box').on('input', function (e) {
      me.fitler_rooms($(this).val().toLowerCase());
    });

    $('.add-room').on('click', function (e) {
      if (typeof me.chatting_add_room_modal === 'undefined') {
        me.chatting_add_room_modal = new chattingAddRoom({
          user: me.user,
          user_email: me.user_email,
        });
      }
      me.chatting_add_room_modal.show();
    });

    $('.user-settings').on('click', function (e) {
      if (typeof me.chatting_user_settings === 'undefined') {
        me.chatting_user_settings = new chattingUserSettings();
      }
      me.chatting_user_settings.show();
    });
  }

  render_messages() {
    this.$chatting_rooms_container.empty();
    for (const element of this.chatting_rooms) {
      element[1].render('append');
    }
  }

  render() {
    this.$wrapper.html(this.$chatting_list);
    this.setup_events();
  }

  move_room_to_top(chatting_room_item) {
    this.chatting_rooms = [
      chatting_room_item,
      ...this.chatting_rooms.filter((item) => item !== chatting_room_item),
    ];
  }

  setup_socketio() {
    const me = this;
    frappe.realtime.on('latest_chatting_updates', function (res) {
      //Find the room with the specified room id
      const chatting_room_item = me.chatting_rooms.find(
        (element) => element[0] === res.room
      );

      if (typeof chatting_room_item === 'undefined') {
        return;
      }

      if (
        !$('.chatting-element').is(':visible') &&
        frappe.chatting.settings.user.enable_notifications === 1
      ) {
        frappe.utils.play_sound('chatting-notification');
      }

      const message =
        res.content.length > 24
          ? res.content.substring(0, 24) + '...'
          : res.content;

      chatting_room_item[1].set_last_message(message, res.creation);

      if ($('.chatting-list').length) {
        chatting_room_item[1].set_as_unread();
        chatting_room_item[1].move_to_top();
        me.move_room_to_top(chatting_room_item);
      } else if ($('.chatting-space').length) {
        mark_message_read(res.room);
      }
    });

    frappe.realtime.on('new_room_creation', function (res) {
      if (
        !$('.chatting-element').is(':visible') &&
        frappe.chatting.settings.user.enable_notifications === 1
      ) {
        frappe.utils.play_sound('chatting-notification');
      }

      res.user = me.user;
      res.is_admin = me.is_admin;
      res.user_email = me.user_email;
      me.create_new_room(res);
    });

    frappe.realtime.on('private_room_creation', function (res) {
      if (
        !$('.chatting-element').is(':visible') &&
        frappe.chatting.settings.user.enable_notifications === 1
      ) {
        frappe.utils.play_sound('chatting-notification');
      }

      if (res.members.includes(me.user_email)) {
        if (res.room_type === 'Direct') {
          res.room_name =
            res.member_names[0]['email'] == me.user_email
              ? res.member_names[1]['name']
              : res.member_names[0]['name'];

          res.opposite_person_email =
            res.member_names[0]['email'] == me.user_email
              ? res.member_names[1]['email']
              : res.member_names[0]['email'];
        }

        res.user = me.user;
        res.is_admin = me.is_admin;
        res.user_email = me.user_email;
        me.create_new_room(res);
      }
    });
  }
}
