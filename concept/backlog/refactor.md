October refactor:
1. Split routine module into 3 or 4:
  - routine module (current)
  - routine instance module (exists, add controller)
  - activity module (add or just create new controller in routine module)
  - activity instance module (add or add controller to routine instance module)
2. Routing: use nest/router module to keep order in routes
3. Transformation pipes: right now we services or db manually from every controller. Use transformation pipe to get object using its id. 
4. JWT guard: right now jwt guard has two puproses: auth and attaching user object to request body. Split it into a guard and transformation pipe, both having a single principle