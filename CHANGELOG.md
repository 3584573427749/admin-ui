## [1.2.0]

### Added

- Rollhantering
- Användarroller
- Roller-vy i Admin UI
- RoleInfoTab
- RoleUsersTab
- ConfirmDialog
- Deep linking för användare och roller

### Changed

- Roller hämtas dynamiskt från API
- Användarvyn använder roller från backend
- Användarvyn skickar med roller i samband med spara
- isActive har tagits bort och ersatts med deletedAt för att visa att användaren borttagen

### Tests

- roleStore
- roleService
- ConfirmDialog
- RoleInfoTab
- RoleUsersTab
- UserInfoTab
