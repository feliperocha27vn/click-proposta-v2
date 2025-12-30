# Documentação: useFieldArray - React Hook Form

## O que é useFieldArray?

O `useFieldArray` é um hook do React Hook Form que facilita o gerenciamento de arrays dinâmicos de campos em formulários. Ele é ideal para situações onde você precisa adicionar, remover ou reordenar múltiplos campos do mesmo tipo (como listas de itens, contatos, serviços, etc.).

## Instalação

```bash
npm install react-hook-form
```

## Conceitos Principais

### Por que usar useFieldArray?

- **Gerenciamento de IDs únicos**: Cada campo recebe um ID único para o React gerenciar corretamente
- **Performance otimizada**: Re-renderiza apenas os campos necessários
- **Validação integrada**: Funciona perfeitamente com o sistema de validação do React Hook Form
- **Type-safe**: Suporte completo ao TypeScript

---

## API Básica

### Importação

```typescript
import { useForm, useFieldArray } from "react-hook-form";
```

### Inicialização

```typescript
const { control } = useForm({
  defaultValues: {
    items: [{ name: "", value: 0 }]
  }
});

const { fields, append, remove, update, replace } = useFieldArray({
  control,
  name: "items"
});
```

### Parâmetros do useFieldArray

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `name` | string | Sim | Nome do campo array no formulário |
| `control` | Control | Sim | Objeto de controle do useForm |
| `keyName` | string | Não | Nome da propriedade de ID (padrão: "id") |
| `rules` | object | Não | Regras de validação para o array |
| `shouldUnregister` | boolean | Não | Se deve desregistrar campos ao desmontar |

### Retorno do useFieldArray

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `fields` | array | Array de campos com IDs únicos |
| `append` | function | Adiciona item(s) no final do array |
| `prepend` | function | Adiciona item(s) no início do array |
| `insert` | function | Insere item em posição específica |
| `remove` | function | Remove item por índice |
| `update` | function | Atualiza item por índice |
| `replace` | function | Substitui todo o array |
| `swap` | function | Troca posição de dois itens |
| `move` | function | Move item para nova posição |

---

## Exemplos Práticos

### 1. Exemplo Básico - Lista de Tarefas

```typescript
import { useForm, useFieldArray } from "react-hook-form";

type FormValues = {
  tasks: { description: string }[];
};

function TodoList() {
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      tasks: [{ description: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks"
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Resultado: { tasks: [{ description: "..." }, { description: "..." }] }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`tasks.${index}.description`)} />
          <button type="button" onClick={() => remove(index)}>
            Remover
          </button>
        </div>
      ))}
      
      <button type="button" onClick={() => append({ description: "" })}>
        Adicionar Tarefa
      </button>
      
      <button type="submit">Salvar</button>
    </form>
  );
}
```

### 2. Exemplo com Múltiplos Campos - Carrinho de Compras

```typescript
import { useForm, useFieldArray, useWatch } from "react-hook-form";

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

type FormValues = {
  cart: CartItem[];
};

// Componente para calcular total em tempo real
const Total = ({ control }: { control: Control<FormValues> }) => {
  const cartItems = useWatch({
    name: "cart",
    control
  });
  
  const total = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );
  
  return <p>Total: R$ {total.toFixed(2)}</p>;
};

function ShoppingCart() {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      cart: [{ name: "", quantity: 1, price: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: "cart",
    control
  });

  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            placeholder="Nome do produto"
            {...register(`cart.${index}.name`, { required: true })}
          />
          
          <input
            placeholder="Quantidade"
            type="number"
            {...register(`cart.${index}.quantity`, {
              valueAsNumber: true,
              required: true
            })}
          />
          
          <input
            placeholder="Preço"
            type="number"
            {...register(`cart.${index}.price`, {
              valueAsNumber: true,
              required: true
            })}
          />
          
          <button type="button" onClick={() => remove(index)}>
            Remover
          </button>
        </div>
      ))}

      <Total control={control} />

      <button
        type="button"
        onClick={() => append({ name: "", quantity: 1, price: 0 })}
      >
        Adicionar Item
      </button>
      
      <button type="submit">Finalizar Compra</button>
    </form>
  );
}
```

### 3. Exemplo com Validação

```typescript
import { useForm, useFieldArray } from "react-hook-form";

type Contact = {
  name: string;
  email: string;
  phone: string;
};

type FormValues = {
  contacts: Contact[];
};

function ContactForm() {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      contacts: [{ name: "", email: "", phone: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
    rules: {
      minLength: 1, // Pelo menos 1 contato
      maxLength: 5  // Máximo 5 contatos
    }
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            {...register(`contacts.${index}.name`, {
              required: "Nome é obrigatório"
            })}
            placeholder="Nome"
          />
          {errors.contacts?.[index]?.name && (
            <span>{errors.contacts[index].name.message}</span>
          )}

          <input
            {...register(`contacts.${index}.email`, {
              required: "Email é obrigatório",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido"
              }
            })}
            placeholder="Email"
          />
          {errors.contacts?.[index]?.email && (
            <span>{errors.contacts[index].email.message}</span>
          )}

          <input
            {...register(`contacts.${index}.phone`, {
              required: "Telefone é obrigatório"
            })}
            placeholder="Telefone"
          />

          <button type="button" onClick={() => remove(index)}>
            Remover
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: "", email: "", phone: "" })}
        disabled={fields.length >= 5}
      >
        Adicionar Contato
      </button>

      <button type="submit">Salvar</button>
    </form>
  );
}
```

### 4. Exemplo com Controller (para componentes customizados)

```typescript
import { useForm, useFieldArray, Controller } from "react-hook-form";

function CustomForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      items: [{ firstName: "", lastName: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.firstName`)} />
          
          {/* Usando Controller para componentes customizados */}
          <Controller
            render={({ field }) => <input {...field} />}
            name={`items.${index}.lastName`}
            control={control}
          />
          
          <button type="button" onClick={() => remove(index)}>
            Remover
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => append({ firstName: "", lastName: "" })}
      >
        Adicionar
      </button>
    </form>
  );
}
```

---

## Métodos Detalhados

### append(obj, options)
Adiciona um ou mais itens no **final** do array.

```typescript
// Adicionar um item
append({ name: "Novo item" });

// Adicionar múltiplos itens
append([{ name: "Item 1" }, { name: "Item 2" }]);

// Com opções
append({ name: "Item" }, { shouldFocus: false });
```

### prepend(obj, options)
Adiciona um ou mais itens no **início** do array.

```typescript
prepend({ name: "Primeiro item" });
```

### insert(index, obj, options)
Insere item em uma **posição específica**.

```typescript
insert(2, { name: "Item no meio" });
```

### remove(index)
Remove item por **índice**. Se não passar índice, remove todos.

```typescript
remove(0);        // Remove primeiro item
remove([0, 2]);   // Remove múltiplos itens
remove();         // Remove todos os itens
```

### update(index, obj)
Atualiza um item específico. **Atenção**: Causa unmount/remount do campo.

```typescript
update(0, { name: "Nome atualizado", value: 100 });
```

### replace(obj)
Substitui **todo o array**.

```typescript
replace([
  { name: "Item 1" },
  { name: "Item 2" }
]);
```

### swap(indexA, indexB)
Troca a posição de dois itens.

```typescript
swap(0, 1); // Troca primeiro com segundo
```

### move(from, to)
Move um item de uma posição para outra.

```typescript
move(0, 2); // Move primeiro item para terceira posição
```

---

## Boas Práticas

### 1. Sempre use field.id como key
```typescript
// ✅ Correto
{fields.map((field, index) => (
  <div key={field.id}>
    {/* ... */}
  </div>
))}

// ❌ Errado
{fields.map((field, index) => (
  <div key={index}>
    {/* ... */}
  </div>
))}
```

### 2. Use defaultValues no useForm
```typescript
// ✅ Correto
const { control } = useForm({
  defaultValues: {
    items: [{ name: "" }]
  }
});

// ❌ Evite inicializar vazio
const { control } = useForm();
```

### 3. Para atualizar valores específicos, prefira setValue
```typescript
// ✅ Melhor performance
setValue(`items.${index}.name`, "Novo nome");

// ⚠️ Causa remount
update(index, { ...items[index], name: "Novo nome" });
```

### 4. Use useWatch para valores em tempo real
```typescript
const items = useWatch({ name: "items", control });
// Agora você pode usar 'items' para cálculos ou exibições
```

---

## Diferenças entre setValue e update

| Aspecto | setValue | update |
|---------|----------|--------|
| Performance | Melhor | Menor |
| Remount | Não | Sim |
| Uso | Atualizar campos específicos | Substituir objeto inteiro |
| Exemplo | `setValue("items.0.name", "x")` | `update(0, { name: "x" })` |

---

## TypeScript - Tipos Completos

```typescript
import { 
  useForm, 
  useFieldArray, 
  Control,
  FieldArrayWithId 
} from "react-hook-form";

type FormValues = {
  services: {
    id: string;
    name: string;
    description: string;
  }[];
};

function MyComponent() {
  const { control } = useForm<FormValues>();
  
  const { 
    fields,      // FieldArrayWithId<FormValues, "services", "id">[]
    append,      // (obj: Service | Service[], options?) => void
    remove,      // (index?: number | number[]) => void
    update,      // (index: number, obj: Service) => void
    // ... outros métodos
  } = useFieldArray({
    control,
    name: "services"
  });
}
```

---

## Solução de Problemas Comuns

### Problema: Campos não atualizam ao usar reset
**Solução**: Use `useEffect` para resetar após carregar dados

```typescript
useEffect(() => {
  if (data) {
    reset({ items: data });
  }
}, [data, reset]);
```

### Problema: Validação não funciona
**Solução**: Certifique-se de usar o padrão correto de nome

```typescript
// ✅ Correto
{...register(`items.${index}.name`, { required: true })}

// ❌ Errado
{...register(`items[${index}].name`, { required: true })}
```

### Problema: Performance ruim com muitos campos
**Solução**: Use `react-window` para virtualização

```typescript
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={500}
  itemCount={fields.length}
  itemSize={40}
  itemKey={(i) => fields[i].id}
>
  {({ index, style }) => (
    <div style={style}>
      <input {...register(`items.${index}.name`)} />
    </div>
  )}
</FixedSizeList>
```

---

## Resumo

O `useFieldArray` é essencial para:
- ✅ Listas dinâmicas de campos
- ✅ Formulários com múltiplos itens
- ✅ Carrinho de compras, listas de tarefas, etc.
- ✅ Gerenciamento automático de IDs
- ✅ Performance otimizada
- ✅ Validação integrada

**Lembre-se**: Sempre use `field.id` como key e prefira `setValue` para atualizações pontuais!
