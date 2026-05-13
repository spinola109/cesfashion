"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  Edit3,
  Image as ImageIcon,
  Package,
  Plus,
  RefreshCw,
  Save,
  Tags,
  Trash2,
  Users,
  X
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { slugify } from "@/lib/slug";

type AdminTab = "products" | "customers" | "categories";

type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  productsCount?: number;
};

type AdminImage = {
  id?: string;
  imageUrl: string;
  alt?: string | null;
  isMain: boolean;
  position: number;
};

type AdminVariant = {
  id?: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
};

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  promotionalPrice: number | null;
  isActive: boolean;
  categoryId: string | null;
  category: AdminCategory | null;
  images: AdminImage[];
  variants: AdminVariant[];
  createdAt: string;
  updatedAt: string;
};

type AdminAddress = {
  id?: string;
  label?: string | null;
  recipient: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
};

type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  document?: string | null;
  addresses: AdminAddress[];
  ordersCount?: number;
  createdAt: string;
  updatedAt: string;
};

type ProductForm = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  promotionalPrice: string;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  images: ImageForm[];
  variants: VariantForm[];
};

type ImageForm = {
  imageUrl: string;
  alt: string;
  isMain: boolean;
  position: string;
};

type VariantForm = {
  size: string;
  color: string;
  stock: string;
  sku: string;
};

type CustomerForm = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  passwordHash: string;
  addresses: AddressForm[];
};

type AddressForm = {
  label: string;
  recipient: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
};

type CategoryForm = {
  id?: string;
  name: string;
  slug: string;
};

const tabs = [
  { id: "products", label: "Produtos", icon: Boxes },
  { id: "customers", label: "Clientes", icon: Users },
  { id: "categories", label: "Categorias", icon: Tags }
] satisfies Array<{ id: AdminTab; label: string; icon: typeof Boxes }>;

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [customerForm, setCustomerForm] = useState<CustomerForm>(emptyCustomerForm);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategoryForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const stats = useMemo(
    () => [
      { label: "Produtos", value: products.length },
      { label: "Clientes", value: customers.length },
      { label: "Categorias", value: categories.length },
      {
        label: "Estoque",
        value: products.reduce(
          (total, product) =>
            total +
            product.variants.reduce((variantTotal, variant) => variantTotal + variant.stock, 0),
          0
        )
      }
    ],
    [categories.length, customers.length, products]
  );

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setError("");

    try {
      const [productsData, customersData, categoriesData] = await Promise.all([
        requestJson<AdminProduct[]>("/api/products"),
        requestJson<AdminCustomer[]>("/api/customers"),
        requestJson<AdminCategory[]>("/api/categories")
      ]);

      setProducts(productsData);
      setCustomers(customersData);
      setCategories(categoriesData);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    const payload = {
      name: productForm.name,
      slug: productForm.slug || slugify(productForm.name),
      description: productForm.description,
      price: productForm.price,
      promotionalPrice: productForm.promotionalPrice || null,
      isActive: productForm.isActive,
      categoryId: productForm.categoryName ? undefined : productForm.categoryId || undefined,
      categoryName: productForm.categoryName || undefined,
      images: productForm.images
        .filter((image) => image.imageUrl.trim())
        .map((image, index) => ({
          imageUrl: image.imageUrl,
          alt: image.alt || undefined,
          isMain: image.isMain || index === 0,
          position: image.position ? Number(image.position) : index
        })),
      variants: productForm.variants
        .filter((variant) => variant.sku.trim())
        .map((variant) => ({
          size: variant.size,
          color: variant.color,
          stock: variant.stock ? Number(variant.stock) : 0,
          sku: variant.sku
        }))
    };

    try {
      await requestJson<AdminProduct>(
        productForm.id ? `/api/products/${productForm.id}` : "/api/products",
        {
          method: productForm.id ? "PATCH" : "POST",
          body: JSON.stringify(payload)
        }
      );

      setProductForm(emptyProductForm());
      setMessage(productForm.id ? "Produto atualizado." : "Produto criado.");
      await loadData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function saveCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    const payload = {
      name: customerForm.name,
      email: customerForm.email,
      phone: customerForm.phone || null,
      document: customerForm.document || null,
      passwordHash: customerForm.passwordHash || null,
      addresses: customerForm.addresses
        .filter((address) => address.recipient || address.street || address.city)
        .map((address) => ({
          label: address.label || undefined,
          recipient: address.recipient,
          street: address.street,
          number: address.number,
          complement: address.complement || undefined,
          neighborhood: address.neighborhood || undefined,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          isDefault: address.isDefault
        }))
    };

    try {
      await requestJson<AdminCustomer>(
        customerForm.id ? `/api/customers/${customerForm.id}` : "/api/customers",
        {
          method: customerForm.id ? "PATCH" : "POST",
          body: JSON.stringify(payload)
        }
      );

      setCustomerForm(emptyCustomerForm());
      setMessage(customerForm.id ? "Cliente atualizado." : "Cliente criado.");
      await loadData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    const payload = {
      name: categoryForm.name,
      slug: categoryForm.slug || slugify(categoryForm.name)
    };

    try {
      await requestJson<AdminCategory>(
        categoryForm.id ? `/api/categories/${categoryForm.id}` : "/api/categories",
        {
          method: categoryForm.id ? "PATCH" : "POST",
          body: JSON.stringify(payload)
        }
      );

      setCategoryForm(emptyCategoryForm());
      setMessage(categoryForm.id ? "Categoria atualizada." : "Categoria criada.");
      await loadData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteResource(type: AdminTab, id: string) {
    const labels: Record<AdminTab, string> = {
      products: "produto",
      customers: "cliente",
      categories: "categoria"
    };

    if (!window.confirm(`Excluir ${labels[type]}?`)) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const endpoint = type === "products" ? "products" : type === "customers" ? "customers" : "categories";
      await requestJson<{ ok: boolean }>(`/api/${endpoint}/${id}`, {
        method: "DELETE"
      });
      setMessage(`${capitalize(labels[type])} excluído.`);
      await loadData();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsSaving(false);
    }
  }

  function editProduct(product: AdminProduct) {
    setActiveTab("products");
    setProductForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      promotionalPrice: product.promotionalPrice ? String(product.promotionalPrice) : "",
      isActive: product.isActive,
      categoryId: product.categoryId ?? product.category?.id ?? "",
      categoryName: "",
      images: product.images.length
        ? product.images.map((image) => ({
            imageUrl: image.imageUrl,
            alt: image.alt ?? "",
            isMain: image.isMain,
            position: String(image.position)
          }))
        : [emptyImageForm()],
      variants: product.variants.length
        ? product.variants.map((variant) => ({
            size: variant.size,
            color: variant.color,
            stock: String(variant.stock),
            sku: variant.sku
          }))
        : [emptyVariantForm()]
    });
  }

  function editCustomer(customer: AdminCustomer) {
    setActiveTab("customers");
    setCustomerForm({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? "",
      document: customer.document ?? "",
      passwordHash: "",
      addresses: customer.addresses.length
        ? customer.addresses.map((address) => ({
            label: address.label ?? "",
            recipient: address.recipient,
            street: address.street,
            number: address.number,
            complement: address.complement ?? "",
            neighborhood: address.neighborhood ?? "",
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            isDefault: address.isDefault
          }))
        : [emptyAddressForm()]
    });
  }

  function editCategory(category: AdminCategory) {
    setActiveTab("categories");
    setCategoryForm({
      id: category.id,
      name: category.name,
      slug: category.slug
    });
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">{item.label}</p>
            <strong className="mt-2 block font-display text-4xl text-white">{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex h-11 min-w-fit items-center gap-2 rounded-full border px-5 text-sm font-semibold transition",
                activeTab === tab.id
                  ? "border-gold bg-gold text-black"
                  : "border-white/10 bg-white/[0.04] text-white/68 hover:border-gold/40 hover:text-gold"
              )}
            >
              <tab.icon size={17} />
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void loadData()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white/68 transition hover:border-gold/40 hover:text-gold"
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      {error ? (
        <div className="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="mt-5 rounded-lg border border-gold/25 bg-gold/10 px-4 py-3 text-sm text-gold">
          {message}
        </div>
      ) : null}

      <div className="mt-6">
        {activeTab === "products" ? renderProducts() : null}
        {activeTab === "customers" ? renderCustomers() : null}
        {activeTab === "categories" ? renderCategories() : null}
      </div>
    </section>
  );

  function renderProducts() {
    return (
      <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <form onSubmit={saveProduct} className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <PanelTitle
            icon={Package}
            title={productForm.id ? "Editar produto" : "Novo produto"}
            onClear={() => setProductForm(emptyProductForm())}
          />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <TextField
              label="Nome"
              value={productForm.name}
              onChange={(value) =>
                setProductForm((form) => ({
                  ...form,
                  name: value,
                  slug: form.slug ? form.slug : slugify(value)
                }))
              }
              required
            />
            <TextField
              label="Slug"
              value={productForm.slug}
              onChange={(value) => setProductForm((form) => ({ ...form, slug: value }))}
              required
            />
            <TextField
              label="Preço"
              value={productForm.price}
              onChange={(value) => setProductForm((form) => ({ ...form, price: value }))}
              required
            />
            <TextField
              label="Preço promocional"
              value={productForm.promotionalPrice}
              onChange={(value) =>
                setProductForm((form) => ({ ...form, promotionalPrice: value }))
              }
            />
            <label className="grid gap-2 text-sm text-white/64">
              Categoria
              <select
                value={productForm.categoryId}
                onChange={(event) =>
                  setProductForm((form) => ({
                    ...form,
                    categoryId: event.target.value,
                    categoryName: ""
                  }))
                }
                className={inputClassName}
              >
                <option value="">Sem categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <TextField
              label="Nova categoria"
              value={productForm.categoryName}
              onChange={(value) =>
                setProductForm((form) => ({
                  ...form,
                  categoryName: value,
                  categoryId: value ? "" : form.categoryId
                }))
              }
            />
            <label className="flex h-12 items-center gap-3 self-end rounded-lg border border-white/10 bg-black/24 px-4 text-sm text-white/70">
              <input
                type="checkbox"
                checked={productForm.isActive}
                onChange={(event) =>
                  setProductForm((form) => ({ ...form, isActive: event.target.checked }))
                }
                className="h-4 w-4 accent-gold"
              />
              Produto ativo
            </label>
          </div>
          <label className="mt-4 grid gap-2 text-sm text-white/64">
            Descrição
            <textarea
              value={productForm.description}
              onChange={(event) =>
                setProductForm((form) => ({ ...form, description: event.target.value }))
              }
              required
              rows={4}
              className={textareaClassName}
            />
          </label>
          <DynamicListHeader
            icon={ImageIcon}
            title="Imagens"
            onAdd={() =>
              setProductForm((form) => ({
                ...form,
                images: [...form.images, emptyImageForm()]
              }))
            }
          />
          <div className="grid gap-3">
            {productForm.images.map((image, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
                <TextField
                  label="URL da imagem"
                  value={image.imageUrl}
                  onChange={(value) => updateProductImage(index, "imageUrl", value)}
                />
                <div className="grid gap-3 md:grid-cols-[1fr_7rem_7rem]">
                  <TextField
                    label="Alt"
                    value={image.alt}
                    onChange={(value) => updateProductImage(index, "alt", value)}
                  />
                  <TextField
                    label="Posição"
                    value={image.position}
                    onChange={(value) => updateProductImage(index, "position", value)}
                  />
                  <label className="flex items-end gap-2 pb-3 text-sm text-white/64">
                    <input
                      type="checkbox"
                      checked={image.isMain}
                      onChange={(event) =>
                        updateProductImage(index, "isMain", event.target.checked)
                      }
                      className="h-4 w-4 accent-gold"
                    />
                    Principal
                  </label>
                </div>
                <RemoveButton
                  onClick={() =>
                    setProductForm((form) => ({
                      ...form,
                      images: form.images.filter((_, itemIndex) => itemIndex !== index)
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <DynamicListHeader
            icon={Package}
            title="Variações"
            onAdd={() =>
              setProductForm((form) => ({
                ...form,
                variants: [...form.variants, emptyVariantForm()]
              }))
            }
          />
          <div className="grid gap-3">
            {productForm.variants.map((variant, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-white/10 bg-black/20 p-3 md:grid-cols-4">
                <TextField
                  label="Tamanho"
                  value={variant.size}
                  onChange={(value) => updateProductVariant(index, "size", value)}
                />
                <TextField
                  label="Cor"
                  value={variant.color}
                  onChange={(value) => updateProductVariant(index, "color", value)}
                />
                <TextField
                  label="Estoque"
                  value={variant.stock}
                  onChange={(value) => updateProductVariant(index, "stock", value)}
                />
                <TextField
                  label="SKU"
                  value={variant.sku}
                  onChange={(value) => updateProductVariant(index, "sku", value)}
                />
                <div className="md:col-span-4">
                  <RemoveButton
                    onClick={() =>
                      setProductForm((form) => ({
                        ...form,
                        variants: form.variants.filter((_, itemIndex) => itemIndex !== index)
                      }))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
          <SubmitButton isSaving={isSaving} label={productForm.id ? "Salvar produto" : "Criar produto"} />
        </form>

        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <ListTitle title="Produtos cadastrados" isLoading={isLoading} />
          <div className="mt-4 grid gap-3">
            {products.map((product) => (
              <article key={product.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-2xl text-white">{product.name}</h3>
                      <span className={cn("rounded-full px-3 py-1 text-xs", product.isActive ? "bg-green-400/12 text-green-200" : "bg-white/10 text-white/50")}>
                        {product.isActive ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/52">{product.slug}</p>
                    <p className="mt-2 text-sm text-white/64">
                      {product.category?.name ?? "Sem categoria"} · {formatCurrency(product.price)}
                    </p>
                    <p className="mt-2 text-sm text-white/52">
                      {product.images.length} imagens · {product.variants.length} variações
                    </p>
                  </div>
                  <RowActions
                    onEdit={() => editProduct(product)}
                    onDelete={() => void deleteResource("products", product.id)}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderCustomers() {
    return (
      <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <form onSubmit={saveCustomer} className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <PanelTitle
            icon={Users}
            title={customerForm.id ? "Editar cliente" : "Novo cliente"}
            onClear={() => setCustomerForm(emptyCustomerForm())}
          />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <TextField
              label="Nome"
              value={customerForm.name}
              onChange={(value) => setCustomerForm((form) => ({ ...form, name: value }))}
              required
            />
            <TextField
              label="E-mail"
              type="email"
              value={customerForm.email}
              onChange={(value) => setCustomerForm((form) => ({ ...form, email: value }))}
              required
            />
            <TextField
              label="Telefone"
              value={customerForm.phone}
              onChange={(value) => setCustomerForm((form) => ({ ...form, phone: value }))}
            />
            <TextField
              label="Documento"
              value={customerForm.document}
              onChange={(value) => setCustomerForm((form) => ({ ...form, document: value }))}
            />
            <TextField
              label="Hash da senha"
              value={customerForm.passwordHash}
              onChange={(value) =>
                setCustomerForm((form) => ({ ...form, passwordHash: value }))
              }
            />
          </div>
          <DynamicListHeader
            icon={Users}
            title="Endereços"
            onAdd={() =>
              setCustomerForm((form) => ({
                ...form,
                addresses: [...form.addresses, emptyAddressForm()]
              }))
            }
          />
          <div className="grid gap-3">
            {customerForm.addresses.map((address, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <TextField
                    label="Etiqueta"
                    value={address.label}
                    onChange={(value) => updateCustomerAddress(index, "label", value)}
                  />
                  <TextField
                    label="Destinatário"
                    value={address.recipient}
                    onChange={(value) => updateCustomerAddress(index, "recipient", value)}
                  />
                  <TextField
                    label="Rua"
                    value={address.street}
                    onChange={(value) => updateCustomerAddress(index, "street", value)}
                  />
                  <TextField
                    label="Número"
                    value={address.number}
                    onChange={(value) => updateCustomerAddress(index, "number", value)}
                  />
                  <TextField
                    label="Complemento"
                    value={address.complement}
                    onChange={(value) => updateCustomerAddress(index, "complement", value)}
                  />
                  <TextField
                    label="Bairro"
                    value={address.neighborhood}
                    onChange={(value) => updateCustomerAddress(index, "neighborhood", value)}
                  />
                  <TextField
                    label="Cidade"
                    value={address.city}
                    onChange={(value) => updateCustomerAddress(index, "city", value)}
                  />
                  <TextField
                    label="Estado"
                    value={address.state}
                    onChange={(value) => updateCustomerAddress(index, "state", value)}
                  />
                  <TextField
                    label="CEP"
                    value={address.zipCode}
                    onChange={(value) => updateCustomerAddress(index, "zipCode", value)}
                  />
                  <label className="flex items-end gap-2 pb-3 text-sm text-white/64">
                    <input
                      type="checkbox"
                      checked={address.isDefault}
                      onChange={(event) =>
                        updateCustomerAddress(index, "isDefault", event.target.checked)
                      }
                      className="h-4 w-4 accent-gold"
                    />
                    Principal
                  </label>
                </div>
                <RemoveButton
                  onClick={() =>
                    setCustomerForm((form) => ({
                      ...form,
                      addresses: form.addresses.filter((_, itemIndex) => itemIndex !== index)
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <SubmitButton isSaving={isSaving} label={customerForm.id ? "Salvar cliente" : "Criar cliente"} />
        </form>

        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <ListTitle title="Clientes cadastrados" isLoading={isLoading} />
          <div className="mt-4 grid gap-3">
            {customers.map((customer) => (
              <article key={customer.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-display text-2xl text-white">{customer.name}</h3>
                    <p className="mt-2 text-sm text-white/64">{customer.email}</p>
                    <p className="mt-2 text-sm text-white/52">
                      {customer.phone || "Sem telefone"} · {customer.addresses.length} endereços
                    </p>
                  </div>
                  <RowActions
                    onEdit={() => editCustomer(customer)}
                    onDelete={() => void deleteResource("customers", customer.id)}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderCategories() {
    return (
      <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <form onSubmit={saveCategory} className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <PanelTitle
            icon={Tags}
            title={categoryForm.id ? "Editar categoria" : "Nova categoria"}
            onClear={() => setCategoryForm(emptyCategoryForm())}
          />
          <div className="mt-5 grid gap-4">
            <TextField
              label="Nome"
              value={categoryForm.name}
              onChange={(value) =>
                setCategoryForm((form) => ({
                  ...form,
                  name: value,
                  slug: form.slug ? form.slug : slugify(value)
                }))
              }
              required
            />
            <TextField
              label="Slug"
              value={categoryForm.slug}
              onChange={(value) => setCategoryForm((form) => ({ ...form, slug: value }))}
              required
            />
          </div>
          <SubmitButton isSaving={isSaving} label={categoryForm.id ? "Salvar categoria" : "Criar categoria"} />
        </form>

        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <ListTitle title="Categorias cadastradas" isLoading={isLoading} />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {categories.map((category) => (
              <article key={category.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-white">{category.name}</h3>
                    <p className="mt-2 text-sm text-white/52">{category.slug}</p>
                    <p className="mt-2 text-sm text-white/64">
                      {category.productsCount ?? 0} produtos
                    </p>
                  </div>
                  <RowActions
                    onEdit={() => editCategory(category)}
                    onDelete={() => void deleteResource("categories", category.id)}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function updateProductImage(
    index: number,
    field: keyof ImageForm,
    value: string | boolean
  ) {
    setProductForm((form) => ({
      ...form,
      images: form.images.map((image, itemIndex) =>
        itemIndex === index ? { ...image, [field]: value } : image
      )
    }));
  }

  function updateProductVariant(index: number, field: keyof VariantForm, value: string) {
    setProductForm((form) => ({
      ...form,
      variants: form.variants.map((variant, itemIndex) =>
        itemIndex === index ? { ...variant, [field]: value } : variant
      )
    }));
  }

  function updateCustomerAddress(
    index: number,
    field: keyof AddressForm,
    value: string | boolean
  ) {
    setCustomerForm((form) => ({
      ...form,
      addresses: form.addresses.map((address, itemIndex) =>
        itemIndex === index ? { ...address, [field]: value } : address
      )
    }));
  }
}

function PanelTitle({
  icon: Icon,
  title,
  onClear
}: {
  icon: typeof Boxes;
  title: string;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
          <Icon size={20} />
        </span>
        <h2 className="font-display text-3xl text-white">{title}</h2>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-gold/40 hover:text-gold"
        aria-label="Limpar formulário"
      >
        <X size={17} />
      </button>
    </div>
  );
}

function DynamicListHeader({
  icon: Icon,
  title,
  onAdd
}: {
  icon: typeof Boxes;
  title: string;
  onAdd: () => void;
}) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between gap-4">
      <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gold">
        <Icon size={16} />
        {title}
      </h3>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-white/70 transition hover:border-gold/40 hover:text-gold"
      >
        <Plus size={15} />
        Adicionar
      </button>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  required = false,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm text-white/64">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className={inputClassName}
      />
    </label>
  );
}

function SubmitButton({ isSaving, label }: { isSaving: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={isSaving}
      className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-gold-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Save size={17} />
      {isSaving ? "Salvando" : label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 w-fit items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-4 text-sm text-red-100 transition hover:border-red-300/45"
    >
      <Trash2 size={15} />
      Remover
    </button>
  );
}

function ListTitle({ title, isLoading }: { title: string; isLoading: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="font-display text-3xl text-white">{title}</h2>
      {isLoading ? <span className="text-sm text-white/45">Carregando</span> : null}
    </div>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-gold/40 hover:text-gold"
        aria-label="Editar"
      >
        <Edit3 size={16} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-100 transition hover:border-red-300/45"
        aria-label="Excluir"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function emptyProductForm(): ProductForm {
  return {
    name: "",
    slug: "",
    description: "",
    price: "",
    promotionalPrice: "",
    isActive: true,
    categoryId: "",
    categoryName: "",
    images: [emptyImageForm()],
    variants: [emptyVariantForm()]
  };
}

function emptyImageForm(): ImageForm {
  return {
    imageUrl: "",
    alt: "",
    isMain: true,
    position: "0"
  };
}

function emptyVariantForm(): VariantForm {
  return {
    size: "",
    color: "",
    stock: "0",
    sku: ""
  };
}

function emptyCustomerForm(): CustomerForm {
  return {
    name: "",
    email: "",
    phone: "",
    document: "",
    passwordHash: "",
    addresses: [emptyAddressForm()]
  };
}

function emptyAddressForm(): AddressForm {
  return {
    label: "",
    recipient: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: true
  };
}

function emptyCategoryForm(): CategoryForm {
  return {
    name: "",
    slug: ""
  };
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });
  const text = await response.text();
  const data = text ? (JSON.parse(text) as { error?: string }) : null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Não foi possível completar a operação.");
  }

  return data as T;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Erro inesperado.";
}

function capitalize(value: string) {
  return value.charAt(0).toLocaleUpperCase("pt-BR") + value.slice(1);
}

const inputClassName =
  "h-12 rounded-lg border border-white/10 bg-black/28 px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-gold/45";

const textareaClassName =
  "rounded-lg border border-white/10 bg-black/28 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-gold/45";
