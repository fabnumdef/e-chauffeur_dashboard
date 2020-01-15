# Changelog
## Current
### Features
* Add recurrence
* Add csv Import
### Fix
## Version 1.4.4
### Features
* Add new component to enforce password strength
* Add explicit error messages on 
* Add possibility for admin to edit his own campus
* Round percents in dashboard
* Add custom reservation scope for campus
* Add red dot to notify created rides regulator
* Luggage visibility increase in planificator
* Added toast messages on phones & cars edit/creation
* Remove logs menu, using Loki stack right now
* Export dashboard and monitoring on deploy
### Fix
* Updated login page ui
* Changed dropdown title when creating a new car in planning
* Fix infosec issue with X-Frame header
* Fix arrow on calendar tooltip
* Fix links to update items in lists
* Fix status translation in dashboard
* Fix ratings labels
* Fix minor bug on list.vue
## Version 1.4.3
### Features
* Add new campus users interface for admin
* Add pins for POIs on the regulator map
* Add logic of automatic static validation
* Add planning vehicule and remove old system
* Add rating page
* Add cars planning and remove old system
* Add user creation error message
* Add ride information on map & rides calendar
* Add activated to POI list and possibility to enable/disable it
### Fix
* Add horizontal scroll in planificator when there is too much driver
* Fix map driver's marker color
* Fix fetch ride when selecting a base
* Fix tooltip overflow on planificator
* Fix rides fetch on campus change
* Fix Winston error
* Handle errors on post/patch /users /campuses/{id}/users /campuses/{id}/drivers
* Fix planificator column alignment between header and body on month and day view
* Fix POI update for admin
* Fix actions display when user has no rights for CRUD
* Fix POI enabled icon for pois lists
* Fix planning sync between cars and drivers
## Version 1.4.2
### Features
* Improve reliability, k8s side
* Update Vue-cal 
* Many improvements of CSS of calendars
* Make hours of calendar configurable
* Show origin or the ride in export / history
### Fix
* Fix z-index on modal in history
## Version 1.4.1
### Features
* Add timezone inside campus entity
* Add loaders where it was missing on select elements
* Remove bubbles in vue cal
* Add css on clic & release on vue cal
* Add bubbles on month view to show number of rides
### Fix
* Fix multiples time slots overlapping
* Fix driver selection on time slot creation
## Version 1.4.0
### Features
* Calendar dependency changed to vue-cal
* Planning for drivers
* Interface for map viz in anterious dates
* Know when API is logged out
* Minimize of the ride creation
### Fix
* Fix map marker
* Fix paginators
* Fix full text search for POI
## Version 1.3.1
### Features
 * Shift + Clic has been removed
### Fix
* Departure and Arrival in history was not dynamic
* User pagination fixed
## Version 1.3.0
### Features
* Add phone management.
* Split map / Scheduler
* Let user change his password
### Fix
* Fix initials on map
* Don't filters POI in search list, frontend side
* Fix token renew
## Version 1.2.1
### Fix
* Only 30 rides was queried in planning
## Version 1.2.0
### Features
* Improved driver management.
* Add POIs per base rights (local admin)
* Use common library
* Fix CSV export
### Fix
## Version 1.1.1
### Features
### Fix
* Filter drivers in map by last position date (2h)
## Version 1.1.0
### Features
* POIs per base
* Rights management reviewed
* Add missing rights controls
* Focus flow
### Fix
* Fix POIs pagination
* Card overflow in planning
* Default start date on create modified
