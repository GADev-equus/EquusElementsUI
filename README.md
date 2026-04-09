# EquusElementsUI

This project is a component library for React.
It uses:

- JavaScript
- React
- vanilla CSS

## workflow

start assistant
↓
"`/prd-writer` create a prd for a button"
↓
"`/technical-writer` create a technical spec from the button prd"
↓
"`/front-end-developer` create a button from the button technical spec"

## project structure

### .agents

stores [agent skills](https://opencode.ai/docs/skills). SKILL.md's are ignored here by git (double-check .gitignore).

### .storybook

boilerplate for storybook. `main.js` sets up a storybook config. `preview.js` sets up storybook's browser UI.

### rules

houses the style guides that skills should instruct the agent to read. Going from idea to code, each guide should be more technical than the previous one:

`prd-writer` guide
↓
`technical-writer` guide (**more** technical)
↓
`front-end-developer` guide (**most** technical)

global CSS rules reside here too.

### sandbox

see blogpost (a-safe-ai-workflow-with-deno-sandboxes.md).

### src

the components, their styling, their corresponding storybook story, and `index.js` to export them all for use in an npm package.

### tasks

.
├── completed.txt
├── prd-[component-name].md
├── technical-spec-[component-name].md
└── todo.txt

stores all of the generated prds and technical specs. `skills/technical-writer` reads a prd and creates a technical spec. `skills/front-end-developer` reads a technical spec and creates a component.

`todo.txt` and `completed.txt` track how complete the library is and what components are left to create. An AI coding agent in a [Ralph loop](https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum) would use these to track its progress. The list of components in `todo.txt` were taken from [Ant Design](https://ant.design).

### tests

houses any tests that aren't [storybook ones](https://storybook.js.org/docs/writing-tests/interaction-testing#writing-interaction-tests) (those should go in `components/[component-name].stories.js`). use [React Testing Library](https://testing-library.com/docs/react-testing-library/example-intro)?

## Using equuselementsui as an npm package

You can test the equuselementsui npm package locally using (npm link)[https://docs.npmjs.com/cli/v9/commands/npm-link]:

```sh
# in this repo
npm run build
npm link
# in a different repo
npm link equuselementsui --save
```

then

```js
// just once (for example, in script.jsx):
import "equuselementsui/style.css";
// App.jsx:
import { Button } from "equuselementsui";
```

## links

[bestofjs: Component library, React](https://bestofjs.org/projects?page=1&limit=30&tags=component&tags=react&sort=total)
[vite: Building for Production: Library Mode](https://vite.dev/guide/build#library-mode)
