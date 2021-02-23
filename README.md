# A rough JavaScript Undo/Redo example in React Table

Visit: https://piglovesyou.github.io/cautious-palm-tree/

#### Features

* Able to undo/redo by `meta+z` and `meta+shift+z` (Watch out for Windows users)
* Editable cells
* Infinite scroll
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

# License

MIT

# Author
Soichi Takamura
