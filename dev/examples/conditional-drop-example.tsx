import {
  createDraggable,
  createDroppable,
  DragDropProvider,
  DragDropSensors,
  useDragDropContext,
} from '../../src'

const Draggable = (props: any) => {
  const draggable = createDraggable(props.id, { type: props.type })
  return (
    <div use:draggable class="draggable">
      {`Draggable type '${props.type}'`}
    </div>
  )
}

const Droppable = (props: any) => {
  const droppable = createDroppable(props.id, { type: props.type })

  const [state] = useDragDropContext()!

  const activeClass = () => {
    if (droppable.isActiveDroppable) {
      if (state.active.draggable?.data['type'] === props.type) {
        return '!droppable-accept'
      } else {
        return '!droppable-reject'
      }
    }
    return ''
  }

  return (
    <div use:droppable class={`droppable ${activeClass()}`}>
      Droppable
      <br />
      {`accepts type '${props.type}'`}
    </div>
  )
}

export const ConditionalDropExample = () => {
  let ref!: HTMLDivElement

  const onDragEnd = ({ draggable, droppable }: any) => {
    if (droppable) {
      if (draggable.data.type === droppable.data.type) {
        droppable.node.append(draggable.node)
      }
    } else {
      ref.append(draggable.node)
    }
  }

  return (
    <DragDropProvider onDragEnd={onDragEnd}>
      <DragDropSensors />
      <div ref={ref} class="min-h-15 flex flex-wrap gap-5 justify-center">
        <Draggable id={1} type="a" />
        <Draggable id={2} type="b" />
      </div>
      <Droppable id={1} type="a" />
      <Droppable id={2} type="b" />
    </DragDropProvider>
  )
}
