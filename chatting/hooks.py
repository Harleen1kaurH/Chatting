from . import __version__ as app_version
from frappe import __version__ as frappe_version

app_name = "Chatting"
app_title = "Chatting"
app_publisher = "Harleen"
app_description = "Dynamic Chatting System"
app_email = "harleenhans004@gmail.com"
app_license = "MIT"
is_frappe_above_v13 = int(frappe_version.split('.')[0]) > 13






app_include_css = ['Chatting.bundle.css'] if is_frappe_above_v13 else [
    '/assets/css/Chatting.css']
app_include_js = ['Chatting.bundle.js'] if is_frappe_above_v13 else [
    '/assets/js/Chatting.js']

# include js, css files in header of web template
web_include_css = ['Chatting.bundle.css'] if is_frappe_above_v13 else [
    '/assets/css/Chatting.css']
web_include_js = ['Chatting.bundle.js'] if is_frappe_above_v13 else [
    '/assets/js/Chatting.js']

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "Chatting/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "Chatting.utils.jinja_methods",
# 	"filters": "Chatting.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "Chatting.install.before_install"
after_install = "Chatting.patches.migrate_Chatting_data.execute"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "Chatting.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"Chatting.tasks.all"
# 	],
# 	"daily": [
# 		"Chatting.tasks.daily"
# 	],
# 	"hourly": [
# 		"Chatting.tasks.hourly"
# 	],
# 	"weekly": [
# 		"Chatting.tasks.weekly"
# 	],
# 	"monthly": [
# 		"Chatting.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "Chatting.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "Chatting.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "Chatting.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"Chatting.auth.validate"
# ]

sounds = [
    {'name': 'Chatting-notification', 'src': '/assets/Chatting/sounds/Chatting-notification.mp3', 'volume': 0.2},
    {'name': 'Chatting-message-send', 'src': '/assets/Chatting/sounds/Chatting-message-send.mp3', 'volume': 0.2},
    {'name': 'Chatting-message-receive', 'src': '/assets/Chatting/sounds/Chatting-message-receive.mp3', 'volume': 0.5}
]
