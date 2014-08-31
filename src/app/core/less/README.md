# The `src/shared/less` Directory

This folder is actually fairly self-explanatory: it contains your LESS/CSS files to be compiled during the build.
That are shared through all the application.

It is important to say that only app specific shared less files should be contained on this folder. If a page needs
its own styles it should be contained on the same folder the page´s html template is contained.

The build process is smart enough to find this files compile and concatenate them

