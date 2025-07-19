import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Shield,
  Save,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  User,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  name?: string;
  password?: string;
}

interface SettingsData {
  sessionTimeout: number;
  passwordPolicy: number;
  apiEndpoint: string;
  backupInterval: number;
  refreshInterval: number;
  maxNodes: number;
  logLevel: string;
  storagePath: string;
}

const DEFAULT_SETTINGS: SettingsData = {
  sessionTimeout: 12,
  passwordPolicy: 8,
  apiEndpoint: "https://api.krokos.local",
  backupInterval: 7,
  refreshInterval: 30,
  maxNodes: 1000,
  logLevel: "INFO",
  storagePath: "/var/lib/krokos-graph",
};

const Settings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Состояния для управления пользователями
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Состояние для настроек
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);

  // Загрузка сохраненных настроек при монтировании
  useEffect(() => {
    const savedSettings = localStorage.getItem("app-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Загрузка пользователей с backend
    fetch("/api/v1/users")
      .then((res) => res.json())
      .then((data) => {
        console.log("Пользователи из API:", data); // <-- добавьте это
        setUsers(data);
      })
      .catch(() => setUsers([]));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Сохраняем в localStorage
      localStorage.setItem("app-settings", JSON.stringify(settings));
      localStorage.setItem("app-users", JSON.stringify(users));

      // Имитация запроса к API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Настройки успешно сохранены");
    } catch (error) {
      toast.error("Ошибка при сохранении настроек");
    } finally {
      setIsSaving(false);
    }
  };

  const openAddUserModal = () => {
    setCurrentUser({
      id: "",
      email: "",
      role: "viewer",
      name: "",
      password: "",
    });
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user: User) => {
    setCurrentUser({ ...user });
    setIsUserModalOpen(true);
  };

  const openDeleteConfirm = (user: User) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  const handleSaveUser = async () => {
    if (!currentUser) return;

    // Валидация
    if (!currentUser.email || !currentUser.name) {
      toast.error("Заполните обязательные поля");
      return;
    }

    try {
      let response;
      if (currentUser.id) {
        // Редактирование существующего пользователя
        response = await fetch(`/api/v1/users/${currentUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: currentUser.name,
            email: currentUser.email,
            password: currentUser.password || "",
            role: currentUser.role,
          }),
        });
      } else {
        // Добавление нового пользователя
        response = await fetch("/api/v1/users/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: currentUser.name,
            email: currentUser.email,
            password: currentUser.password,
            role: currentUser.role,
          }),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Ошибка при сохранении пользователя");
      }

      toast.success(`Пользователь ${currentUser.email} сохранён`);
      setIsUserModalOpen(false);
      setCurrentUser(null);

      // Перезагрузить пользователей с backend
      fetch("/api/v1/users")
        .then((res) => res.json())
        .then((data) => setUsers(data));
    } catch (error: any) {
      toast.error(error.message || "Ошибка при сохранении пользователя");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/v1/users/${userToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Ошибка при удалении пользователя");
      }
      toast.success(`Пользователь ${userToDelete.email} удалён`);
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
      // Перезагрузить пользователей с backend
      fetch("/api/v1/users")
        .then((res) => res.json())
        .then((data) => setUsers(data));
    } catch (error: any) {
      toast.error(error.message || "Ошибка при удалении пользователя");
    }
  };

  const handleUserInputChange = (field: keyof User, value: string) => {
    if (!currentUser) return;

    setCurrentUser({
      ...currentUser,
      [field]: value,
    });
  };

  const handleSettingsChange = (
    field: keyof SettingsData,
    value: string | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-blue-500">Admin</Badge>;
      case "editor":
        return <Badge className="bg-green-500">Editor</Badge>;
      case "viewer":
        return <Badge className="bg-gray-500">Viewer</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Настройки системы
          </h1>
          <p className="text-gray-600 mt-1">
            Управление пользователями и конфигурация системы
          </p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? "Сохраняем..." : "Сохранить"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Управление пользователями
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                Пользователи системы ({users.length})
              </span>
              <Button size="sm" variant="outline" onClick={openAddUserModal}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить пользователя
              </Button>
            </div>

            {/* Добавлен контейнер с фиксированной высотой и прокруткой */}
            <div
              className="space-y-3 overflow-y-auto"
              style={{
                maxHeight: "300px",
                overflowY: users.length >= 4 ? "auto" : "visible", // >4
              }}
            >
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{user.email}</div>
                    <div className="text-sm text-gray-500">
                      {user.name || "Без имени"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(user.role)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditUserModal(user)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    {user.role !== "admin" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDeleteConfirm(user)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Настройки безопасности
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Время сессии (часы)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) =>
                  handleSettingsChange("sessionTimeout", Number(e.target.value))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-policy">Минимальная длина пароля</Label>
              <Input
                id="password-policy"
                type="number"
                value={settings.passwordPolicy}
                onChange={(e) =>
                  handleSettingsChange("passwordPolicy", Number(e.target.value))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input
                id="api-endpoint"
                value={settings.apiEndpoint}
                onChange={(e) =>
                  handleSettingsChange("apiEndpoint", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backup-interval">
                Интервал резервного копирования (дни)
              </Label>
              <Input
                id="backup-interval"
                type="number"
                value={settings.backupInterval}
                onChange={(e) =>
                  handleSettingsChange("backupInterval", Number(e.target.value))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Конфигурация системы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="refresh-interval">
                Интервал обновления данных (сек)
              </Label>
              <Input
                id="refresh-interval"
                type="number"
                value={settings.refreshInterval}
                onChange={(e) =>
                  handleSettingsChange(
                    "refreshInterval",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-nodes">Максимальное количество узлов</Label>
              <Input
                id="max-nodes"
                type="number"
                value={settings.maxNodes}
                onChange={(e) =>
                  handleSettingsChange("maxNodes", Number(e.target.value))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="log-level">Уровень логирования</Label>
              <Input
                id="log-level"
                value={settings.logLevel}
                onChange={(e) =>
                  handleSettingsChange("logLevel", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage-path">Путь к данным</Label>
              <Input
                id="storage-path"
                value={settings.storagePath}
                onChange={(e) =>
                  handleSettingsChange("storagePath", e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Модальное окно для добавления/редактирования пользователя */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentUser?.id
                ? "Редактировать пользователя"
                : "Добавить пользователя"}
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о пользователе
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                value={currentUser?.email || ""}
                onChange={(e) => handleUserInputChange("email", e.target.value)}
                placeholder="user@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Имя *</Label>
              <Input
                id="name"
                value={currentUser?.name || ""}
                onChange={(e) => handleUserInputChange("name", e.target.value)}
                placeholder="Имя пользователя"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Роль</Label>
              <Select
                value={currentUser?.role || "viewer"}
                onValueChange={(value) => handleUserInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="editor">Редактор</SelectItem>
                  <SelectItem value="viewer">Наблюдатель</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!currentUser?.id && (
              <div className="space-y-2">
                <Label htmlFor="password">Пароль *</Label>
                <Input
                  id="password"
                  type="password"
                  value={currentUser?.password || ""}
                  onChange={(e) =>
                    handleUserInputChange("password", e.target.value)
                  }
                  placeholder="Создайте пароль"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveUser}>
              {currentUser?.id
                ? "Сохранить изменения"
                : "Добавить пользователя"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Модальное окно подтверждения удаления */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердите удаление</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить пользователя {userToDelete?.email}?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
              <div className="bg-gray-200 rounded-full p-2">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <div className="font-medium">{userToDelete?.email}</div>
                <div className="text-sm text-gray-500">
                  {userToDelete?.name || "Без имени"}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;

// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Users, Shield, Save, Plus, Edit, Trash2, Loader2 } from "lucide-react";
// import { toast } from "sonner";

// const Settings: React.FC = () => {
//   const [isSaving, setIsSaving] = useState(false);

//   const handleSave = async () => {
//     setIsSaving(true);

//     toast.success("Сохраняем настройки...");

//     setTimeout(() => {
//       toast.success("Применяем изменения к системе");
//     }, 1000);

//     setTimeout(() => {
//       setIsSaving(false);
//       toast.success("Настройки успешно сохранены");
//     }, 3000);
//   };

//   const handleUserAction = (action: string, userName: string) => {
//     toast.success(`${action} пользователя ${userName}...`);

//     setTimeout(() => {
//       toast.success(`Действие выполнено для ${userName}`);
//     }, 1500);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Настройки системы
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Управление пользователями и конфигурация системы
//           </p>
//         </div>
//         <Button size="sm" onClick={handleSave} disabled={isSaving}>
//           {isSaving ? (
//             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//           ) : (
//             <Save className="h-4 w-4 mr-2" />
//           )}
//           {isSaving ? "Сохраняем..." : "Сохранить"}
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* User Management */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users className="h-5 w-5" />
//               Управление пользователями
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="font-medium">Пользователи системы</span>
//               <Button size="sm" variant="outline">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Добавить
//               </Button>
//             </div>

//             <div className="space-y-3">
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div>
//                   <div className="font-medium">admin@krokos.com</div>
//                   <div className="text-sm text-gray-500">Администратор</div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge>Admin</Badge>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() =>
//                       handleUserAction("Редактируем", "admin@krokos.com")
//                     }
//                   >
//                     <Edit className="h-3 w-3" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div>
//                   <div className="font-medium">editor@krokos.com</div>
//                   <div className="text-sm text-gray-500">Редактор</div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge variant="secondary">Editor</Badge>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() =>
//                       handleUserAction("Редактируем", "editor@krokos.com")
//                     }
//                   >
//                     <Edit className="h-3 w-3" />
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() =>
//                       handleUserAction("Удаляем", "editor@krokos.com")
//                     }
//                   >
//                     <Trash2 className="h-3 w-3" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div>
//                   <div className="font-medium">viewer@krokos.com</div>
//                   <div className="text-sm text-gray-500">Наблюдатель</div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge variant="outline">Viewer</Badge>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() =>
//                       handleUserAction("Редактируем", "viewer@krokos.com")
//                     }
//                   >
//                     <Edit className="h-3 w-3" />
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() =>
//                       handleUserAction("Удаляем", "viewer@krokos.com")
//                     }
//                   >
//                     <Trash2 className="h-3 w-3" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Security Settings */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5" />
//               Настройки безопасности
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="session-timeout">Время сессии (часы)</Label>
//               <Input id="session-timeout" type="number" defaultValue="12" />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password-policy">Минимальная длина пароля</Label>
//               <Input id="password-policy" type="number" defaultValue="8" />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="api-endpoint">API Endpoint</Label>
//               <Input
//                 id="api-endpoint"
//                 defaultValue="https://api.krokos.local"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="backup-interval">
//                 Интервал резервного копирования (дни)
//               </Label>
//               <Input id="backup-interval" type="number" defaultValue="7" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* System Configuration */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Конфигурация системы</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="refresh-interval">
//                 Интервал обновления данных (сек)
//               </Label>
//               <Input id="refresh-interval" type="number" defaultValue="30" />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="max-nodes">Максимальное количество узлов</Label>
//               <Input id="max-nodes" type="number" defaultValue="1000" />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="log-level">Уровень логирования</Label>
//               <Input id="log-level" defaultValue="INFO" />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="storage-path">Путь к данным</Label>
//               <Input id="storage-path" defaultValue="/var/lib/krokos-graph" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Settings;
