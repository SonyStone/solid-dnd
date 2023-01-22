import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  createSortable,
  closestCenter,
  maybeTransformStyle,
  CollisionDetector,
  DragEventHandler,
  Draggable,
  Droppable,
} from '../../src'
import { batch, createSignal, For } from 'solid-js'
import { createStore } from 'solid-js/store'

const Sortable = (props: { item: string | number }) => {
  const sortable = createSortable(props.item)
  return (
    <div use:sortable class="sortable" classList={{ 'opacity-25': sortable.isActiveDraggable }}>
      {props.item}
    </div>
  )
}

const SortableOverlay = (props: { item: string | number }) => {
  return <div class="sortable">{props.item}</div>
}

const Column = (props: { id: string; items: number[] }) => {
  const sortable = createSortable(props.id)
  return (
    <div
      ref={sortable.ref}
      style={maybeTransformStyle(sortable.transform)}
      classList={{ 'opacity-25': sortable.isActiveDraggable }}
    >
      <div class="column-header" {...sortable.dragActivators}>
        {props.id}
      </div>
      <div class="column bg-gray-100">
        <SortableProvider ids={props.items}>
          <For each={props.items}>{item => <Sortable item={item} />}</For>
        </SortableProvider>
      </div>
    </div>
  )
}

const ColumnOverlay = (props: { id: string; items: number[] }) => {
  return (
    <div>
      <div class="column-header">{props.id}</div>
      <div class="column bg-gray-100">
        <For each={props.items}>{item => <SortableOverlay item={item} />}</For>
      </div>
    </div>
  )
}

// Board
export const BoardExample = () => {
  const [containers, setContainers] = createStore<{ [key: string]: number[] }>({
    A: [1, 2, 3],
    B: [4, 5, 6],
    C: [7],
  })
  const containerIds = () => Object.keys(containers)
  const [containerOrder, setContainerOrder] = createSignal(Object.keys(containers))

  const isContainer = (id: string) => containerIds().includes(id)

  const getContainer = (id: number) => {
    for (const [key, items] of Object.entries(containers)) {
      if (items.includes(id)) {
        return key
      }
    }
  }

  const closestContainerOrItem: CollisionDetector = (draggable, droppables, context) => {
    const closestContainer = closestCenter(
      draggable,
      droppables.filter(droppable => isContainer(droppable.id as string)),
      context,
    )
    if (isContainer(draggable.id as string)) {
      return closestContainer
    } else if (closestContainer) {
      const containerItemIds = containers[closestContainer.id as string]!
      const closestItem = closestCenter(
        draggable,
        droppables.filter(droppable => containerItemIds.includes(droppable.id as number)),
        context,
      )
      if (!closestItem) {
        return closestContainer
      }

      if (getContainer(draggable.id as number) !== closestContainer.id) {
        const isLastItem =
          containerItemIds.indexOf(closestItem.id as number) === containerItemIds.length - 1

        if (isLastItem) {
          const belowLastItem = draggable.transformed.center.y > closestItem.transformed.center.y

          if (belowLastItem) {
            return closestContainer
          }
        }
      }
      return closestItem
    }

    return null
  }

  const move = (draggable: Draggable, droppable: Droppable, onlyWhenChangingContainer = true) => {
    const draggableIsContainer = isContainer(draggable.id as string)
    const draggableContainer = (
      draggableIsContainer ? draggable.id : getContainer(draggable.id as number)
    )!
    const droppableContainer = (
      isContainer(droppable.id as string) ? droppable.id : getContainer(droppable.id as number)
    )!

    if (draggableContainer != droppableContainer || !onlyWhenChangingContainer) {
      if (draggableIsContainer) {
        const fromIndex = containerOrder().indexOf(draggable.id as string)
        const toIndex = containerOrder().indexOf(droppable.id as string)
        const updatedOrder = containerOrder().slice()
        updatedOrder.splice(toIndex, 0, ...updatedOrder.splice(fromIndex, 1))
        setContainerOrder(updatedOrder)
      } else {
        const containerItemIds = containers[droppableContainer]!
        let index = containerItemIds.indexOf(droppable.id as number)
        if (index === -1) index = containerItemIds.length

        batch(() => {
          setContainers(draggableContainer, items => items.filter(item => item !== draggable.id))
          setContainers(droppableContainer, items => [
            ...items.slice(0, index),
            draggable.id as number,
            ...items.slice(index),
          ])
        })
      }
    }
  }

  const onDragOver: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable && !isContainer(draggable.id as string)) {
      move(draggable, droppable)
    }
  }

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      move(draggable, droppable, false)
    }
  }

  return (
    <div class="flex flex-col flex-1 mt-5 self-stretch">
      <DragDropProvider
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        collisionDetector={closestContainerOrItem}
      >
        <DragDropSensors />
        <div class="columns">
          <SortableProvider ids={containerOrder()}>
            <For each={containerOrder()}>{key => <Column id={key} items={containers[key]!} />}</For>
          </SortableProvider>
        </div>
        <DragOverlay>
          {
            ((draggable: Draggable) => {
              const id = draggable.id as string
              return isContainer(id) ? (
                <ColumnOverlay id={id} items={containers[id]!} />
              ) : (
                <SortableOverlay item={id} />
              )
            }) as any
          }
        </DragOverlay>
      </DragDropProvider>
    </div>
  )
}
