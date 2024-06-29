<div align="center" style="text-align: center"><img src="https://raw.githubusercontent.com/vincehi/pulp/main/icons/icon-test.png" width="80" alt="pulp logo"/></div>

<p align="center">
  <a href="https://github.com//vincehi/pulp/releases/latest">
    🔗 Go to Download Page
  </a>
  &nbsp; | &nbsp; Give it a Star ⭐ | &nbsp;
  <a href="https://www.linkedin.com/in/vincentsourice/">
    Share it on Linkedin 👋
  </a>
</p>

<hr />

# Pulp - Open Source Audio Sample Manager

Pulp is an open source alternative
to [ADSR Sample Manager](https://www.adsrsounds.com/product/software/adsr-sample-manager/). This application allows you
to scan a folder, retrieve audio files and organize them effectively. In addition
to being an audio sample management tool, Pulp is also an audio file explorer.

<div align="center" style="text-align: center; padding: 20px"><img src="https://raw.githubusercontent.com/vincehi/pulp/main/assets/img/app-pulp.png" width="100%" alt="pulp logo"/></div>

## Features

- Cross-plateform : Windows, MacOS (intel / Silicon), Linux
- Scan a folder and retrieve audio files
- Easily organize and search your audio files
- Modern and user-friendly interface
- Automatic detection of BPM, key, etc (soon)

## Technology

Pulp was developed with [Tauri](https://tauri.studio/), [Prisma](https://www.prisma.io/) and SQLite for the back-end
and [Solid-JS](https://github.com/ryansolid/solid) for the front-end.

## Installation and Usage

_CLI cargo commands must be typed in the `src-tauri` folder fortunately there is a npm command that allows us to type
any cargo command from the root `npm run cargo -- <here>`_

example :
`npm run cargo -- prisma generate`
_for the CLI [prisma-client-rust](https://prisma.brendonovich.dev/getting-started/setup)_

**Starter**

- Rename `src-tauri/.env.dist` to `src-tauri/.env` and replace `<user>` in `DATABASE_URL` for macOS (For the other OS
  repect `<app_data_dir>/databases/Database.db` and check
  documentation [here](https://tauri.app/v1/api/js/path/#appdatadir)
  and [there](https://docs.rs/tauri/1.2.4/tauri/struct.PathResolver.html#method.app_data_dir) and
  adjust `<app_data_dir>`).
- Install cargo packages : `npm run cargo -- install`
- Install npm packages : `npm install`
- Push in db first migration : `npm run cargo -- prisma migrate dev --name init`.
- Generate Prisma Rust Client : `npm run cargo -- prisma generate`.
- Command helper for generate prisma client javascript with types : `npm run prisma-js -- generate`
  and `npx prisma studio` if you want see the DB.
- Start dev
  with : `npm run tauri dev` [Tauri Development Cycle](https://tauri.app/v1/guides/development/development-cycle)

_I created this command because unfortunately `prisma-client-rust` did not allow me to generate the javascript client.
So this command is a helper to generate the prisma javascript client and take advantage of the types in the javascript
code._

The VS Code debugging is configured in the `.vscode` folder, you just have to download
the [vscode-lldb](https://github.com/vadimcn/vscode-lldb) extension as
shown [here](https://tauri.app/v1/guides/debugging/vs-code)

The commands will evolve in the future to be more generic

## Contributing

Pulp is an open source project and we welcome contributions. If you would like to contribute, please check our GitHub
repository for more information on contribution processes.

## Acknowledgements

~~This project utilizes Essentia, an open source audio analysis and processing library. We would like to express our
gratitude to the Essentia development team for their contributions to the field of audio processing. For more
information about Essentia, please visit their [official website](https://essentia.upf.edu/).~~

We would like to thank all contributors for their support and help in developing Pulp. We couldn't have done it without
you.
