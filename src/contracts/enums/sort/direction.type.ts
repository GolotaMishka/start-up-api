enum DirectionType {
  asc = 'asc',
  desc = 'desc',
}

export const getSortDirection = (direction: DirectionType) => direction.toUpperCase() as 'ASC' | 'DESC';

export default DirectionType;
