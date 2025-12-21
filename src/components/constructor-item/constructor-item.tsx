import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { DropTargetMonitor } from 'react-dnd';

import styles from './constructor-item.module.css';

type IConstructorItemProps = {
  ingredient: {
    _id: string;
    name: string;
    price: number;
    image: string;
    uniqueId: string;
  };
  index: number;
  onRemove: () => void;
  moveIngredient: (dragIndex: number, hoverIndex: number) => void;
};

type DragItem = {
  index: number;
  id: string;
  type: string;
};

const ConstructorItem: React.FC<IConstructorItemProps> = ({
  ingredient,
  index,
  onRemove,
  moveIngredient,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: 'constructor-item',
    item: () => {
      console.log('Dragging item:', { index, id: ingredient.uniqueId });
      return {
        index,
        id: ingredient.uniqueId,
        type: 'constructor-item',
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: 'constructor-item',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      console.log(`Moving item from ${dragIndex} to ${hoverIndex}`);
      moveIngredient(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
      ref={ref}
      className={`${styles.item}`}
      style={{
        opacity,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      data-testid={`constructor-item-${index}`}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={onRemove}
      />
    </div>
  );
};

export default React.memo(ConstructorItem);
