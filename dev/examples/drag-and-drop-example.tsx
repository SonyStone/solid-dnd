import { createSignal, Show } from 'solid-js'

import {
  createDraggable,
  createDroppable,
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
} from '../../src'

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      // use:model
      sortable: any
      droppable: any
      draggable: any
    }
  }
}

const Draggable = () => {
  const draggable = createDraggable(1)
  return (
    <div use:draggable class="draggable">
      Draggable
    </div>
  )
}

const Droppable = (props: any) => {
  const droppable = createDroppable(1)
  return (
    <div use:droppable class="droppable" classList={{ 'opacity-25': droppable.isActiveDroppable }}>
      Droppable.
      {props.children}
    </div>
  )
}

export const DragAndDropExample = () => {
  console.log(`DragAndDropExample created!`)

  const [where, setWhere] = createSignal('outside')

  const onDragEnd: DragEventHandler = ({ droppable }) => {
    if (droppable) {
      setWhere('inside')
    } else {
      setWhere('outside')
    }
  }

  return (
    <DragDropProvider onDragEnd={onDragEnd}>
      <DragDropSensors />
      <div class="min-h-15">
        <Show when={where() === 'outside'}>
          <Draggable />
        </Show>
      </div>
      <Droppable>
        <Show when={where() === 'inside'}>
          <Draggable />
        </Show>
      </Droppable>
    </DragDropProvider>
  )
}
