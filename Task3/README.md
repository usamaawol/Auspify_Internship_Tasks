# My Tasks — To-Do App

**Internship Task 3** is a browser-based task manager for adding daily tasks, tracking completion, and filtering a saved task list.

## Project overview

The app provides a compact place for an individual to capture and review everyday activities. It is intended for a learner or personal user who wants a lightweight task list without creating an account or connecting to a server.

The application is implemented with browser-native HTML, CSS, and JavaScript. Tasks are saved in the current browser's `localStorage`, so this is a local, single-browser experience rather than a synchronized multi-user service.

## Objectives

- Build a useful interface around a form, list, filters, and summary counts.
- Manage application data with vanilla JavaScript.
- Persist user changes locally and handle storage errors.
- Provide feedback, empty states, keyboard-focus styling, and small-screen layouts.

## Features

- **Add tasks:** The form trims whitespace, requires nonempty text, and limits task text to 200 characters.
- **Task list:** Each task displays its text and creation date, a completion checkbox, and a delete button.
- **Complete or reopen:** A checkbox toggles a task's `completed` flag. Completed text is styled with a line-through.
- **Filters:** All, Remaining, and Completed buttons change which tasks are displayed. Their `.active` class and `aria-pressed` values stay synchronized.
- **Summary:** Total, remaining, and completed counts are recomputed from the task array.
- **Clear Completed:** Removes all completed tasks, with feedback when there are none.
- **Empty states:** The page distinguishes between no tasks and no tasks matching the selected filter.
- **Date and feedback:** The header shows the current date; live messages report validation and task actions.
- **Local persistence:** Tasks are stored under the `auspify-todo-tasks` local-storage key.

The app does not include editing, due dates, categories, accounts, remote synchronization, or notifications; these are not implemented features.

## Technologies

| Technology | Use |
|---|---|
| HTML5 | Form, summary, filter controls, list container, and live regions |
| CSS3 | Layout, theme, responsive styling, focus states, and reduced-motion handling |
| Vanilla JavaScript | State, DOM rendering, event handlers, validation, and local persistence |
| Web Storage API | Saving task records to browser `localStorage` |

No packages, backend, API, database, or bundler are used.

## Architecture and data flow

The HTML provides stable element IDs. `script.js` selects those elements, initializes `tasks` from local storage, and maintains a separate `currentFilter`. User events update the in-memory task array. `saveTasks()` serializes the array, and `renderTasks()` rebuilds the visible list and refreshes the counts and empty state.

Each task has this shape:

```js
{
  id: "unique string",
  text: "Task description",
  completed: false,
  createdAt: "ISO date string"
}
```

```text
Task3/
├── index.html
├── script.js
├── style.css
└── README.md
```

### Important functions

- `loadTasks()` parses the stored JSON, verifies it is an array, and filters out records that do not have valid basic fields.
- `saveTasks()` writes the current array and returns a success value. On a write error, it logs the error and displays a message.
- `createTaskId()` prefers `crypto.randomUUID()` and has a timestamp/random fallback.
- `renderTasks()` filters the data, creates list elements with DOM APIs, updates empty-state text, and recalculates summary values.
- `toggleTask()`, `deleteTask()`, and the Clear Completed handler modify task state and restore the previous state if saving fails.
- `updateFilterButtons()` updates both visual and accessibility state for the three filter controls.

Task text is inserted using `textContent` rather than interpreted as HTML. Task records are local to the browser profile and origin in which the site is opened.

## UI and responsive design

The design uses a light gray page background, white panels, charcoal text, a coral primary accent, and green completion emphasis. A compact header and date card precede three summary cards; the add form and task list are grouped into separate panels.

At widths below 600px, the header and task controls stack, the add button fills the form width, and filter buttons can wrap. The CSS provides visible keyboard focus and disables transitions / smooth scrolling when the user requests reduced motion.

## How to see/open the project
The page can be opened directly as `index.html`; use the server when testing the site at a consistent browser origin.


## How to use

1. Type a task in **What do you need to do?** and select **Add Task**.
2. Use the checkbox to mark it complete or reopen it.
3. Choose All, Remaining, or Completed to filter the list.
4. Choose **Delete** on a task to remove only that task.
5. Choose **Clear Completed** to remove all completed tasks.
6. Refresh the page to confirm that saved tasks load again.

## Testing and verification

No automated test runner is included. Manually check:

- Empty and whitespace-only input produces a message without adding a task.
- Valid task text adds to the list and updates total/remaining counts.
- Text longer than 200 characters is rejected.
- Completion updates the visual style and the remaining/completed counts.
- Each filter shows the expected subset and has the correct pressed state.
- Delete and Clear Completed update the list and persist after refresh.
- With no tasks or no filter matches, the appropriate empty state is shown.
- If browser storage is unavailable, the page reports that it could not save changes.

## Challenges and solutions

- **Keeping list, filters, and counts consistent:** `renderTasks()` centralizes visible-list and summary updates after task changes.
- **Persisted data may be malformed:** `loadTasks()` catches JSON/storage errors and validates the basic fields of each record before using it.
- **Storage writes can fail:** Mutations that write data roll back in-memory changes if `saveTasks()` reports failure, and the UI surfaces a message.
- **Safe user-provided text:** Task names are assigned as text nodes, not inserted as markup.

## Learning outcomes

This project is a practical introduction to modeling records in JavaScript, rendering DOM elements, listening to form and button events, filtering arrays, formatting dates, and using local storage. It also demonstrates why a UI should keep empty states, counts, and accessibility attributes in sync with application state.

## Future improvements

- Add editing, due dates, priorities, and categories if the task model is extended.
- Add export/import or an authenticated backend for moving tasks between devices.
- Add automated unit and browser tests around state changes and storage failures.
- Consider a confirmation step for bulk deletion if the app is used with larger task lists.

## Conclusion

My Tasks is a focused to-do application that uses vanilla JavaScript state and local browser persistence to support a complete task lifecycle: add, filter, complete, delete, and clear completed tasks.
