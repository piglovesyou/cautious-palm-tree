# Example of Editable Grid with Undo/Redo feature

Visit https://piglovesyou.github.io/cautious-palm-tree/ to see the working example.

#### Features

* Editable cells
* Able to undo/redo by `meta+z` and `meta+shift+z` (Watch out for Windows users)
* Works fine with 100k rows, thanks to react-window
* Infinite scroll without pagination
* Full sized table

#### My idea to implement Undo/Redo

Problem to implement undo/redo is to manage diff or snapshot of user's operation history.

* Diff needs smaller memory size but difficult to manage and pop/apply.
* Snapshotting every operation is heavy.

My idea is to use JavaScript's `prototype` as layers of diffs, just like Git commits or file system in Docker images.

* It's a Diff strategy. Only, we don't have to implement diff patching.
* We just can wrap old object by a new one through `var newRef = Object.create(oldRef)`
* Reference to `newRef.__proto__` to get the previous state
* Prototype chain resolves all the actual values. It should be relatively fast, especially if it's limited depth. 50 would be enough for users?

#### Performance

* PureComponent protects cells to be re-rendered. It only redraws when the value changes.
* Make inputs [uncontrolled](https://reactjs.org/docs/forms.html#controlled-components). It manages a single data array and no more unnecessary states. 

# License

MIT

# Author
Soichi Takamura
