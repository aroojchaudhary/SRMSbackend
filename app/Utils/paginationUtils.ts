import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm';

interface PaginationFilter {
  columns: string | string[];
  operation?: string;
  value: any;
}
interface PaginationSort {
  column: string;
  order: 'asc' | 'desc';
}
interface PaginationOptions {
  page: number;
  pageSize: number;
  filter?: PaginationFilter[];
  sort?: PaginationSort;
}
export async function paginationUtils(
  query: ModelQueryBuilderContract<any>,
  { page, pageSize, filter, sort }: PaginationOptions,
  response: HttpContextContract['response']
) {
  try {
    // Apply filtering if "filter" array is provided
    if (filter && Array.isArray(filter)) {
      filter.forEach((filterItem) => {
        const { columns, operation = '=', value } = filterItem;
        if (!columns || !value) {
          return;
        }
        if (Array.isArray(columns)) {
          // Apply OR condition for multiple columns
          query = query.orWhere(function () {
            columns.forEach((col) => {
              query.orWhere(col, operation, value);
            });
          });
        } else {
          // Apply single condition for a single column
          query = query.where(columns, operation, value);
        }
      });
    }
    // Get total count for pagination
    const total = await query.clone().count('* as total');
    // Apply sorting if needed
    if (sort && Object.keys(sort).length > 0) {
      const { column, order } = sort;
      query = query.orderBy(column, order);
    }
    // Apply pagination
    const paginatedData = await query.paginate(page, pageSize);
    return ({
      total: total[0].$extras.total,
      paginatedData,
    });
  } catch (error) {
    console.error(error);
    response.status(400).send(error);
  }
}
