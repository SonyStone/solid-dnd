import {
  createDraggable,
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  Draggable,
  DragOverlay,
} from '../../src'

const DraggableEl = (props: { id: number }) => {
  const draggable = createDraggable(props.id)
  return (
    <div
      use:draggable
      class="draggable absolute"
      classList={{ 'opacity-25': draggable.isActiveDraggable }}
      style={{ top: 0, left: (props.id === 1 ? 0 : 125) + 'px' }}
    >
      Draggable {props.id}
    </div>
  )
}

export const DragMoveExample = () => {
  let transform = { x: 0, y: 0 }

  const onDragMove: DragEventHandler = ({ overlay }) => {
    if (overlay) {
      transform = { ...overlay.transform }
    }
  }

  const onDragEnd: DragEventHandler = ({ draggable }) => {
    const node = draggable.node
    node.style.setProperty('top', node.offsetTop + transform.y + 'px')
    node.style.setProperty('left', node.offsetLeft + transform.x + 'px')
  }

  return (
    <DragDropProvider onDragMove={onDragMove} onDragEnd={onDragEnd}>
      <DragDropSensors />
      <div class="min-h-15 w-full h-full relative">
        <DraggableEl id={1} />
        <DraggableEl id={2} />
      </div>
      <DragOverlay>
        {((draggable: Draggable) => <div class="draggable">Draggable {draggable.id}</div>) as any}
      </DragOverlay>
    </DragDropProvider>
  )
}
