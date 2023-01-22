import './App.css'

import { createOptions, Select } from '@thisbeyond/solid-select'
import { Component, createSignal, JSX, lazy, Show } from 'solid-js'

const examples: { label: string; value: () => JSX.Element }[] = [
  {
    label: 'Basic drag & drop',
    value: lazy(() =>
      import('./examples/drag-and-drop-example').then(m => ({ default: m.DragAndDropExample })),
    ),
  },
  {
    label: 'Drag overlay',

    value: lazy(() =>
      import('./examples/drag-overlay-example').then(m => ({ default: m.DragOverlayExample })),
    ),
  },
  {
    label: 'Conditional drop',
    value: lazy(() =>
      import('./examples/conditional-drop-example').then(m => ({
        default: m.ConditionalDropExample,
      })),
    ),
  },
  {
    label: 'Fine grained / drag handle',
    value: lazy(() =>
      import('./examples/fine-grained-example').then(m => ({ default: m.FineGrainedExample })),
    ),
  },
  {
    label: 'Custom transform (rotate on drag)',
    value: lazy(() =>
      import('./examples/custom-transform').then(m => ({
        default: m.CustomTransformExample,
      })),
    ),
  },
  {
    label: 'Custom transformer (limit x-axis)',
    value: lazy(() =>
      import('./examples/constrain-axis-example').then(m => ({ default: m.ConstrainAxisExample })),
    ),
  },
  {
    label: 'Arbitrary drag move',

    value: lazy(() =>
      import('./examples/drag-move-example').then(m => ({ default: m.DragMoveExample })),
    ),
  },
  {
    label: 'Sortable list (vertical)',
    value: lazy(() =>
      import('./examples/sortable-vertical-list-example').then(m => ({
        default: m.SortableVerticalListExample,
      })),
    ),
  },
  {
    label: 'Sortable list (horizontal)',
    value: lazy(() =>
      import('./examples/sortable-horizontal-list-example').then(m => ({
        default: m.SortableHorizontalListExample,
      })),
    ),
  },
  {
    label: 'Multiple lists',
    value: lazy(() =>
      import('./examples/multiple-lists-example').then(m => ({ default: m.MultipleListsExample })),
    ),
  },
  {
    label: 'Board',
    value: lazy(() => import('./examples/board-example').then(m => ({ default: m.BoardExample }))),
  },
  {
    label: 'Debugger',
    value: lazy(() =>
      import('./examples/debugger-example').then(m => ({ default: m.DebuggerExample })),
    ),
  },
]

const App: Component = () => {
  const [example, setExample] = createSignal<{ label: string; value: () => JSX.Element }>()
  const selectProps = createOptions(examples, { key: '0' })

  return (
    <div class="flex flex-col place-content-center place-items-center text-center p-10 min-h-100vh gap-2">
      <h1 class="text-3xl font-bold underline">Examples:</h1>
      <Select
        class="home"
        placeholder="Select example..."
        options={examples}
        optionToValue={(option: any) => option}
        isOptionDisabled={(option: any) => option.disabled}
        format={option => option.label}
        onChange={value => {
          console.log(`value`, value)
          setExample(value)
        }}
      />
      <div class="flex flex-col w-1/2 p-1 gap-1">
        <div class="w-full lg:flex-1 flex flex-col justify-center items-center gap-5 overflow-hidden border-3 border-dashed border-[#42403a] rounded-lg p-6 relative">
          <Show when={example()} fallback={<></>}>
            {example()!.value()}
          </Show>
        </div>
      </div>
    </div>
  )
}

export default App
