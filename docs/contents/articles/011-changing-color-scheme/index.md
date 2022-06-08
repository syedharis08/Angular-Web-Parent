---
title: Changing Color Scheme
---

We tried to make the process of color scheme customization as easy as possible. 

By default Angular4-baseproject has three built-in color profiles: ng2 (default blur sheme), mint and blue.
This article will help you to create your own color profile.
Let's say you want to make Angular4-BaseProject dark theme.

First we advise you to take some existing colorscheme file as a starting point. 
For light themes we suggest taking `src/app/theme/sass/conf/colorScheme/_mint.scss` and for 
dark `src/app/theme/sass/conf/colorScheme/_blue.scss`.
As we want a light theme, we're taking `blur`.

1) Copy `src/app/theme/sass/conf/colorScheme/_blur.scss` to `src/app/theme/sass/conf/colorScheme/_dark.scss`:
<br><br>

2) Include your colorscheme file in `src/app/theme/sass/conf/conf.scss`.

To do this, replace
```scss
@import 'colorSchemes/ng2';
```

with

```scss
@import 'colorSchemes/dark';
```
<br><br>

3) Change the color scheme enabled:

Open `src/app/theme/theme.config.ts`.
Uncomment the following line

```javascript
  //this._baConfig.changeTheme({name: 'my-theme'});
``` 

and put your theme name, in our case it is `dark`

```javascript
  this._baConfig.changeTheme({name: 'dark'});
``` 
Beside notifying the system which scheme is currently enabled, this also puts a css class to a main element 
of the page. Thus you can freely create theme-specific css selectors in your code without breakking other themes' styles.

For example like this:
```scss
. dark .card-body {
  background-color: white;
}
```
<br><br>

4) Change the colors:

Now you can start changing the colors.
For example, after playing a bit with different colors, we changed the 2 first main variables in `_dark.scss` file:
```sass
$body-bg: #636363;
$bootstrap-panel-bg: rgba(#000000, 0.2);

```

After this is done, you need to setup javascript to use the **same colors**. These colors 
are used for javascript charts and other components (maps, etc); 
Let's completely change the JS colors to a new set.
To do this, add the following code to the configuration block inside `src/app/theme/theme.config.ts`:
```javascript
  let colorScheme = {
    primary: '#209e91',
    info: '#2dacd1',
    success: '#90b900',
    warning: '#dfb81c',
    danger: '#e85656',
  };
  this._baConfig.changeColors({
    default: '#4e4e55',
    defaultText: '#e2e2e2',
    border: '#dddddd',
    borderDark: '#aaaaaa',

    primary: colorScheme.primary,
    info: colorScheme.info,
    success: colorScheme.success,
    warning: colorScheme.warning,
    danger: colorScheme.danger,

    primaryLight: ColorHelper.tint(colorScheme.primary, 30),
    infoLight: ColorHelper.tint(colorScheme.info, 30),
    successLight: ColorHelper.tint(colorScheme.success, 30),
    warningLight: ColorHelper.tint(colorScheme.warning, 30),
    dangerLight: ColorHelper.tint(colorScheme.danger, 30),

    primaryDark: ColorHelper.shade(colorScheme.primary, 15),
    infoDark: ColorHelper.shade(colorScheme.info, 15),
    successDark: ColorHelper.shade(colorScheme.success, 15),
    warningDark: ColorHelper.shade(colorScheme.warning, 15),
    dangerDark: ColorHelper.shade(colorScheme.danger, 15),

    dashboard: {
      blueStone: '#005562',
      surfieGreen: '#0e8174',
      silverTree: '#6eba8c',
      gossip: '#b9f2a1',
      white: '#10c4b5',
    },
  });
``` 
Here we defined a list of main colors `colorScheme` and then made light and dark versions of those using `ColorHelper` methods. 
We also defined a couple of custom colors for dashboard charts.


For further reference, please look in
- Colorscheme scss file (`src/app/theme/sass/conf/colorScheme/_ng2.scss`, `src/app/theme/sass/conf/colorScheme/_mint.scss` and `src/app/theme/sass/conf/colorScheme/_blur.scss`)
- `src/app/theme/theme.configProvider.js` to understand which javascript colors can be changed

