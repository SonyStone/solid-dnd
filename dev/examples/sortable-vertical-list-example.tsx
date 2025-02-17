import { createSignal, For } from 'solid-js'

import {
  closestCenter,
  createSortable,
  DragDropProvider,
  DragDropSensors,
  DragEvent,
  DragOverlay,
  SortableProvider,
  useDragDropContext,
} from '../../src'

const Sortable = (props: any) => {
  const sortable = createSortable(props.item)
  const [state] = useDragDropContext()!
  return (
    <div
      use:sortable
      class="sortable"
      classList={{
        'opacity-25': sortable.isActiveDraggable,
        'transition-transform': !!state.active.draggable,
      }}
    >
      {props.item}
    </div>
  )
}

export const SortableVerticalListExample = () => {
  const [items, setItems] = createSignal([1, 2, 3])
  const [activeItem, setActiveItem] = createSignal(null)
  const ids = () => items()

  const onDragStart = ({ draggable }: any) => setActiveItem(draggable.id)

  const onDragEnd = ({ draggable, droppable }: DragEvent) => {
    if (draggable && droppable) {
      const currentItems = ids()
      const fromIndex = currentItems.indexOf(draggable.id as number)
      const toIndex = currentItems.indexOf(droppable.id as number)
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice()
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1))
        setItems(updatedItems)
      }
    }
  }

  return (
    <DragDropProvider
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetector={closestCenter}
    >
      <DragDropSensors />
      <div class="column self-stretch">
        <SortableProvider ids={ids()}>
          <For each={items()}>{item => <Sortable item={item} />}</For>
        </SortableProvider>
      </div>
      <DragOverlay>
        <div class="sortable">{activeItem()}</div>
      </DragOverlay>
    </DragDropProvider>
  )
}
