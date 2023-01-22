import { batch, For } from 'solid-js'
import { createStore } from 'solid-js/store'

import {
  closestCenter,
  CollisionDetector,
  createDroppable,
  createSortable,
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  Draggable,
  DragOverlay,
  Droppable,
  SortableProvider,
} from '../../src'

const Sortable = (props: any) => {
  const sortable = createSortable(props.item)
  return (
    <div use:sortable class="sortable" classList={{ 'opacity-25': sortable.isActiveDraggable }}>
      {props.item}
    </div>
  )
}

const Column = (props: any) => {
  const droppable = createDroppable(props.id)
  return (
    <div use:droppable class="column">
      <SortableProvider ids={props.items}>
        <For each={props.items}>{item => <Sortable item={item} />}</For>
      </SortableProvider>
    </div>
  )
}

export const MultipleListsExample = () => {
  const [containers, setContainers] = createStore<Record<string, number[]>>({
    A: [1, 2, 3],
    B: [4, 5, 6],
  })

  const containerIds = () => Object.keys(containers)

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
    if (closestContainer) {
      const containerItemIds = containers[closestContainer.id]!
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
    const draggableContainer = getContainer(draggable.id as number)!
    const droppableContainer = (
      isContainer(droppable.id as string)
        ? (droppable.id as number)
        : getContainer(droppable.id as number)
    )!

    if (draggableContainer != droppableContainer || !onlyWhenChangingContainer) {
      const containerItemIds = containers[droppableContainer as string]!
      let index = containerItemIds.indexOf(droppable.id as number)
      if (index === -1) index = containerItemIds.length

      batch(() => {
        setContainers(draggableContainer, items => items.filter(item => item !== draggable.id))
        setContainers(droppableContainer as string, items => [
          ...items.slice(0, index),
          draggable.id as number,
          ...items.slice(index),
        ])
      })
    }
  }

  const onDragOver: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
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
        <div class="column">
          <For each={containerIds()}>{key => <Column id={key} items={containers[key]} />}</For>
        </div>
        <DragOverlay>
          {((draggable: Draggable) => <div class="sortable">{draggable.id}</div>) as any}
        </DragOverlay>
      </DragDropProvider>
    </div>
  )
}
