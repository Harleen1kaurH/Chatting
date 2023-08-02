import chattingSpace from './chatting_space';
import {
  get_date_from_now,
  mark_message_read,
  get_time,
  get_avatar_html,
  set_notification_count,
} from './chatting_utils';

export default class chattingRoom {
  constructor(opts) {
    this.$wrapper = opts.$wrapper;
    this.$chatting_rooms_container = opts.$chatting_rooms_container;
    this.chatting_list = opts.chatting_list;
    this.profile = opts.element;
    this.setup();
    if (!this.profile.is_read) {
      set_notification_count('increment');
    }
  }

  setup() {
    this.$chatting_room = $(document.createElement('div'));
    this.$chatting_room.addClass('chatting-room');

    this.avatar_html = get_avatar_html(
      this.profile.room_type,
      this.profile.opposite_person_email,
      this.profile.room_name
    );

    let last_message = this.sanitize_last_message(this.profile.last_message);

    const info_html = `
			<div class='chatting-profile-info'>
				<div class='chatting-name'>
					${__(this.profile.room_name)} 
					<div class='chatting-latest' 
						style='display: ${this.profile.is_read ? 'none' : 'inline-block'}'
					></div>
				</div>
				<div style='color: ${
          this.profile.is_read ? 'var(--text-muted)' : 'var(--text-color)'
        }' class='last-message'>${__(last_message)}</div>
			</div>
		`;
    const date_html = `
			<div class='chatting-date'>
				${__(get_date_from_now(this.profile.last_date, 'room'))}
			</div>
		`;
    let inner_html = '';

    inner_html += this.avatar_html + info_html + date_html;

    this.$chatting_room.html(inner_html);
  }

  sanitize_last_message(message) {
    let sanitize_last_message = $('<div>').text(message).html();
    if (sanitize_last_message) {
      if (sanitize_last_message.length > 20) {
        sanitize_last_message = sanitize_last_message.substring(0, 20) + '...';
      }
    }
    return sanitize_last_message;
  }

  set_as_read() {
    this.profile.is_read = 1;
    this.$chatting_room.find('.last-message').css('color', 'var(--text-muted)');
    this.$chatting_room.find('.chatting-latest').hide();
    set_notification_count('decrement');
  }

  set_last_message(message, date) {
    const sanitized_message = this.sanitize_last_message(message);
    this.$chatting_room.find('.last-message').html(__(sanitized_message));
    this.$chatting_room.find('.chatting-date').text(__(get_time(date)));
  }

  set_as_unread() {
    if (this.profile.is_read) {
      set_notification_count('increment');
    }
    this.profile.is_read = 0;
    this.$chatting_room.find('.last-message').css('color', 'var(--text-color)');
    this.$chatting_room.find('.chatting-latest').show();
  }

  render(mode) {
    if (mode == 'append') {
      this.$chatting_rooms_container.append(this.$chatting_room);
    } else {
      this.$chatting_rooms_container.prepend(this.$chatting_room);
    }

    this.setup_events();
  }

  move_to_top() {
    $(this.$chatting_room).prependTo(this.$chatting_rooms_container);
  }

  setup_events() {
    this.$chatting_room.on('click', () => {
      if (typeof this.chatting_space !== 'undefined') {
        this.chatting_space.render();
      } else {
        this.chatting_space = new chattingSpace({
          $wrapper: this.$wrapper,
          chatting_list: this.chatting_list,
          profile: this.profile,
        });
      }
      if (this.profile.is_read === 0) {
        mark_message_read(this.profile.room);
        this.set_as_read();
      }
    });
  }
}
