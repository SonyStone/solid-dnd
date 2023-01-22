import {
  createDraggable,
  DragDropProvider,
  DragDropSensors,
  Transformer,
  useDragDropContext,
} from '../../src'

const Draggable = () => {
  const draggable = createDraggable(1)
  return (
    <div use:draggable class="draggable">
      Draggable
    </div>
  )
}

const ConstrainDragAxis = () => {
  const [, { onDragStart, onDragEnd, addTransformer, removeTransformer }] = useDragDropContext()!

  const transformer: Transformer = {
    id: 'constrain-x-axis',
    order: 100,
    callback: transform => ({ ...transform, x: 0 }),
  }

  onDragStart(({ draggable }) => {
    addTransformer('draggables', draggable.id, transformer)
  })

  onDragEnd(({ draggable }) => {
    removeTransformer('draggables', draggable.id, transformer.id)
  })

  return <></>
}

export const ConstrainAxisExample = () => {
  return (
    <DragDropProvider>
      <DragDropSensors />
      <ConstrainDragAxis />
      <div class="min-h-35">
        <Draggable />
      </div>
    </DragDropProvider>
  )
}
