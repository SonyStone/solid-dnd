import { Transform } from 'src/layout'

import { createDraggable, DragDropProvider, DragDropSensors } from '../../src'

const Draggable = () => {
  const draggable = createDraggable(1)

  const customTransformStyle = (transform: Transform) => {
    const sign = transform.x >= 0 ? '+' : '-'
    return {
      translate: `${transform.x}px ${transform.y}px 0px`,
      rotate: `z ${draggable.isActiveDraggable ? `${sign}15deg` : '0deg'}`,
    }
  }

  return (
    <div
      class="draggable"
      ref={draggable.ref}
      style={customTransformStyle(draggable.transform)}
      {...draggable.dragActivators}
    >
      Draggable
    </div>
  )
}

export const CustomTransformExample = () => {
  return (
    <DragDropProvider>
      <DragDropSensors />
      <div class="min-h-35">
        <Draggable />
      </div>
    </DragDropProvider>
  )
}
