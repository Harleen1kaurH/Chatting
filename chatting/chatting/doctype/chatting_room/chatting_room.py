# Copyright (c) 2023, Harleen and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class ChattingRoom(Document):
	def get_members(self):
		if self.members:
			return [x.strip() for x in self.members.split(",")]
		return []
		
