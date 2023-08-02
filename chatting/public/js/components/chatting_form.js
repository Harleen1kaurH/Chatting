import { create_guest } from './chatting_utils';
import chattingSpace from './chatting_space';

export default class chattingForm {
  constructor(opts) {
    this.$wrapper = opts.$wrapper;
    this.profile = opts.profile;
    this.setup();
  }

  setup() {
    this.$chatting_form = $(document.createElement('div'));
    this.$chatting_form.addClass('chatting-form');
    this.setup_header();
    this.setup_form();
  }

  setup_header() {
    this.avatar_html = frappe.avatar(null, 'avatar-medium', this.profile.name);
    const header_html = `
			<div class='chatting-header mb-2'>
				${this.avatar_html}
				<div class='chatting-profile-info'>
					<div class='chatting-profile-name'>
						${__(this.profile.name)}
						<div class='online-circle'></div>
					</div>
					<div class='chatting-profile-status'>${__('Typically replies in a few hours')}</div>
				</div>
			</div>
		`;
    this.$chatting_form.append(header_html);
  }

  setup_form() {
    const form_html = `
			<div class='chatting-form-container'>
				<p class='chatting-query-heading'>${__('Share your queries or comments here.')}</p>
				<form>
					<div class='form-group'>
						<label class='form-label'>${__('Full Name')}</label>
						<input type='text' class='form-control' id='chatting-fullname' 
							placeholder='${__('Please enter your full name')}'>
					</div>
					<div class='form-group'>
						<label class='form-label'>${__('Email Address')}</label>
						<input type='email' class='form-control' id='chatting-email' 
							placeholder='${__('Please enter your email')}'>
					</div>
					<div class='form-group'>
						<label class='form-label'>${__('Message')}</label>
						<textarea class='form-control' id='chatting-message-area' 
							placeholder='${__('Please enter your message')}'></textarea>
					</div>
					<button type='button' class='btn btn-primary w-100'
						id='submit-form'>
            ${__('Submit')}
          </button>
				</form>
			</div>
		`;
    const footer_html = `
      <a class='chatting-footer' target='_blank' href='https://frappeframework.com/'>
        ${__('⚡ Powered by Frappe')}
      </a>
    `;
    this.$chatting_form.append(form_html + footer_html);
  }

  get_values() {
    const result = {
      email: $('#chatting-email').val(),
      full_name: $('#chatting-fullname').val(),
      message: $('#chatting-message-area').val(),
    };
    return result;
  }

  async validate_form() {
    try {
      const form_values = this.get_values();
      const res = await create_guest(form_values);

      if (!res) {
        return;
      }
      const query_message = {
        content: form_values.message,
        creation: new Date(),
        sender: res.guest_name,
        sender_email: res.email,
      };
      localStorage.setItem('guest_token', res.token);

      let profile = {
        room_name: this.profile.name,
        room: res.room,
        is_admin: this.profile.is_admin,
        user: res.guest_name,
        user_email: res.email,
        message: query_message,
        room_type: res.room_type,
      };

      const chatting_space = new chattingSpace({
        $wrapper: this.$wrapper,
        profile: profile,
      });
    } catch (error) {
      //pass
    }
  }

  render() {
    this.$wrapper.html(this.$chatting_form);
    const me = this;
    $('#submit-form').on('click', function () {
      me.validate_form();
    });
  }
}
