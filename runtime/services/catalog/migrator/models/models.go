package models

import (
	"context"
	"errors"
	"fmt"
	"regexp"
	"strings"

	runtimev1 "github.com/rilldata/rill/proto/gen/rill/runtime/v1"
	"github.com/rilldata/rill/runtime/drivers"
	"github.com/rilldata/rill/runtime/services/catalog/migrator"
)

func init() {
	migrator.Register(drivers.ObjectTypeModel, &modelMigrator{})
}

type modelMigrator struct{}

func (m *modelMigrator) Create(ctx context.Context, olap drivers.OLAPStore, repo drivers.RepoStore, catalogObj *drivers.CatalogEntry) error {
	rows, err := olap.Execute(ctx, &drivers.Statement{
		Query: fmt.Sprintf(
			"CREATE OR REPLACE VIEW %s AS (%s)",
			catalogObj.Name,
			sanitizeQuery(catalogObj.GetModel().Sql, false),
		),
		Priority: 100,
	})
	if err != nil {
		return err
	}
	return rows.Close()
}

func (m *modelMigrator) Update(ctx context.Context, olap drivers.OLAPStore, repo drivers.RepoStore, catalogObj *drivers.CatalogEntry) error {
	return m.Create(ctx, olap, repo, catalogObj)
}

func (m *modelMigrator) Rename(ctx context.Context, olap drivers.OLAPStore, from string, catalogObj *drivers.CatalogEntry) error {
	if strings.EqualFold(from, catalogObj.Name) {
		tempName := fmt.Sprintf("__rill_temp_%s", from)
		rows, err := olap.Execute(ctx, &drivers.Statement{
			Query:    fmt.Sprintf("ALTER VIEW %s RENAME TO %s", from, tempName),
			Priority: 100,
		})
		if err != nil {
			return err
		}
		rows.Close()
		from = tempName
	}

	rows, err := olap.Execute(ctx, &drivers.Statement{
		Query:    fmt.Sprintf("ALTER VIEW %s RENAME TO %s", from, catalogObj.Name),
		Priority: 100,
	})
	if err != nil {
		return err
	}
	return rows.Close()
}

func (m *modelMigrator) Delete(ctx context.Context, olap drivers.OLAPStore, catalogObj *drivers.CatalogEntry) error {
	rows, err := olap.Execute(ctx, &drivers.Statement{
		Query:    fmt.Sprintf("DROP VIEW IF EXISTS %s", catalogObj.Name),
		Priority: 100,
	})
	if err != nil {
		return err
	}
	return rows.Close()
}

func (m *modelMigrator) GetDependencies(ctx context.Context, olap drivers.OLAPStore, catalog *drivers.CatalogEntry) []string {
	return ExtractTableNames(catalog.GetModel().Sql)
}

func (m *modelMigrator) Validate(ctx context.Context, olap drivers.OLAPStore, catalog *drivers.CatalogEntry) []*runtimev1.ReconcileError {
	_, err := olap.Execute(ctx, &drivers.Statement{
		Query:    catalog.GetModel().Sql,
		Priority: 100,
		DryRun:   true,
	})
	if err != nil {
		return migrator.CreateValidationError(catalog.Path, err.Error())
	}
	return nil
}

func (m *modelMigrator) IsEqual(ctx context.Context, cat1, cat2 *drivers.CatalogEntry) bool {
	return cat1.GetModel().Dialect == cat2.GetModel().Dialect &&
		// TODO: handle same queries but different text
		sanitizeQuery(cat1.GetModel().Sql, true) == sanitizeQuery(cat2.GetModel().Sql, true)
}

func (m *modelMigrator) ExistsInOlap(ctx context.Context, olap drivers.OLAPStore, catalog *drivers.CatalogEntry) (bool, error) {
	_, err := olap.InformationSchema().Lookup(ctx, catalog.Name)
	if errors.Is(err, drivers.ErrNotFound) {
		return false, nil
	} else if err != nil {
		return false, err
	}
	return true, nil
}

var (
	QueryCommentRegex     = regexp.MustCompile(`(?m)--.*$`)
	MultipleSpacesRegex   = regexp.MustCompile(`\s\s+`)
	SpacesAfterCommaRegex = regexp.MustCompile(`,\s+`)
)

// TODO: use this while extracting source names to get case insensitive DAG
// TODO: should this be used to store the sql in catalog?
func sanitizeQuery(query string, toLower bool) string {
	// remove all comments
	query = QueryCommentRegex.ReplaceAllString(query, " ")
	// new line => space
	query = strings.ReplaceAll(query, "\n", " ")
	// multiple spaces => single space
	query = MultipleSpacesRegex.ReplaceAllString(query, " ")
	// remove all spaces after a comma
	query = SpacesAfterCommaRegex.ReplaceAllString(query, ",")
	query = strings.ReplaceAll(query, ";", "")
	if toLower {
		query = strings.ToLower(query)
	}
	return strings.TrimSpace(query)
}
