## GET /docs
Authorization: Bearer <TOKEN>

Récupère les documents.

### Réponse
```json
{
[
    {
        "id": 12,
        "name": "1744843891488",
        "extension": "pdf",
        "userId": 1
    },
    {
        "id": 13,
        "name": "1744843934110",
        "extension": "pdf",
        "userId": 1
    },
]
}
```



## POST /docs/search
Authorization: Bearer <TOKEN>

Rechercher un par mot clé

### Paramètres
- `query, type, format` (body) : mot clé à chercher
```json
{"query": "image 1", "type": "CV", "format": "PDF"}

### Réponse
```json
{[{
        "_index": "documents",
        "_id": "dNnxQJYBqCHNnxZIvoTB",
        "_score": 0.94335747,
        "_ignored": [
            "content.keyword"
        ],
        "_source": {
            "filename": "name",
            "content": "Content",
            "size": 465943,
            "uploadDate": "2025-04-16T23:31:45.730Z",
            "mimetype": "application/pdf"
        }
}]}
```


## DELETE /docs
Authorization: Bearer <TOKEN>

Supprimer un document spécifique

### Paramètres
- `id` (path) : ID du document

### Réponse
```json
{
    "message": "Document supprimé"
}
```

## POST /docs/search
Authorization: Bearer <TOKEN>

Rechercher un par mot clé

### Paramètres
- `document` (file) : mot clé à chercher
```form-data

### Réponse
```json
{
    "message": "Document indexé avec succès"
}
```

## POST /download/{id}
Authorization: Bearer <TOKEN>

Supprimer un document spécifique

### Paramètres
- `id` (path) : ID du document

### Réponse
```json
{
    "message": "Document supprimé"
}
```