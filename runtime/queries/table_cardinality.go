package queries

import (
	"context"
	"fmt"

	"github.com/rilldata/rill/runtime"
)

type TableCardinality struct {
	TableName  string
	ColumnName string
	Result     int64
}

var _ runtime.Query = &TableCardinality{}

func (q *TableCardinality) Key() string {
	return fmt.Sprintf("TableCardinality:%s", q.TableName)
}

func (q *TableCardinality) Deps() []string {
	return []string{q.TableName}
}

func (q *TableCardinality) MarshalResult() any {
	return q.Result
}

func (q *TableCardinality) UnmarshalResult(v any) error {
	res, ok := v.(int64)
	if !ok {
		return fmt.Errorf("TableCardinality: mismatched unmarshal input")
	}
	q.Result = res
	return nil
}

func (q *TableCardinality) Resolve(ctx context.Context, rt *runtime.Runtime, instanceID string, priority int) error {
	countSql := fmt.Sprintf("SELECT count(*) AS count FROM %s",
		quoteName(q.TableName),
	)

	rows, err := rt.Execute(ctx, instanceID, priority, countSql)
	if err != nil {
		return err
	}
	defer rows.Close()

	var count int64
	for rows.Next() {
		err = rows.Scan(&count)
		if err != nil {
			return err
		}
	}
	q.Result = count
	return nil
}
