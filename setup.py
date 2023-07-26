from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in chatting/__init__.py
from chatting import __version__ as version

setup(
	name="chatting",
	version=version,
	description="Dynamic Chatting System",
	author="Harleen",
	author_email="harleenhans004@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
