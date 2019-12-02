#!/usr/bin/env python
"""Setup script for json-merge."""

from setuptools import setup, find_packages


try:  # for pip >= 10
    from pip._internal.req import parse_requirements
    from pip._internal.download import PipSession
except ImportError:  # for pip <= 9.0.3
    from pip.req import parse_requirements
    from pip.download import PipSession


install_requires = parse_requirements('requirements.txt', session=PipSession())
dependencies = [str(package.req) for package in install_requires]

setup(name='JSON-Merge',
      include_package_data=True,
      version='1.0.0',
      description='CLI utility to merge JSON files.',
      author='Ravi Teja Gannavarapu',
      author_email='iamravitejag@gmail.com',
      url='https://github.com/IamRaviTejaG/json-merge',
      py_modules=['merge'],
      python_requires='>=3',
      install_requires=dependencies,
      entry_points='''
            [console_scripts]
            jsonmerge=merge:merge
        '''
      )
