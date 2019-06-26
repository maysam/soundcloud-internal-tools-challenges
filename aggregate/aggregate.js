var assert = require('assert');

var items = [
    { id: 8, playTime:  500, auto: false },
    { id: 7, playTime: 1500, auto: true  },
    { id: 1, playTime:  100, auto: true  },
    { id: 7, playTime: 1000, auto: false },
    { id: 7, playTime: 2000, auto: false },
    { id: 2, playTime: 2000, auto: true  },
    { id: 2, playTime: 2000, auto: true  }
]

function select(items, options={}){
  if (options.id !== undefined) {
    items = items.filter(item => item.id == options.id)
  }
  if (options.auto !== undefined) {
    items = items.filter(item => item.auto == options.auto)
  }
  if (options.minPlayTime !== undefined) {
    items = items.filter(item => item.playTime >= options.minPlayTime)
  }
  if (options.merge !== undefined) {
    items = items.reduce((merged_items, item)  => {
      var merged_item_index = merged_items.findIndex(current => current.id == item.id)
      if (merged_item_index === -1) {
        // new id
        merged_items.push({
          id: item.id,
          playTime: item.playTime,
          auto: item.auto
        })
      } else {
        // repeated id
        merged_item = merged_items[merged_item_index]
        merged_item.playTime += item.playTime,
        merged_item.auto = merged_item.auto && item.auto

        // in the case of merging items with duplicate ids, the row should take the place of the latest occurrence of that id
        merged_items.splice(merged_item_index,1)
        merged_items.push(merged_item)
      }
      return merged_items
    }, [])
  }
  return items
}

assert(select(items).length === 7)

assert(select(items, {id: 2}).length === 2)
assert(select(items, {auto: true}).length === 4)
assert(select(items, {auto: false}).length === 3)
assert(select(items, {minPlayTime: 1500}).length === 4)

assert(select(items, {merge: true}).length === 4)
assert.deepEqual(select(items, {merge: true}).map((x)=>x.id), [8,1,7,2])
// in the case of merging items with duplicate ids, the row should take the place of the latest occurrence of that id

// - if any of the `auto` fields are `false` the result should be `false`
assert(!select(items, {merge: true, id:7})[0].auto)
assert(!select(items, {merge: true, id:7, auto: false})[0].auto)
assert(select(items, {merge: true, id:7, auto: true})[0].auto)

assert(select(items, {merge: true, id: 2}).length === 1)
assert(select(items, {merge: true, id: 2})[0].playTime === 4000)
