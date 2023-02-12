---
order: {{:order}}
{{if icon}}icon:
{{if icon.type}}  type: {{:icon.type}}{{/if}}
{{if icon.color}}  color: {{:icon.color}}{{/if}}{{/if}}
---
# {{:title}}

{{:desc}}


## Markdown Cheat Sheet
___

Notes can have a table of contents:

[toc]

## 1. Text

**Input:**
~~~md
# Heading1
## Heading2
### Heading3
**bold text**  
*italicized text*
> blockquote

For normal text just type but  
to go on to next line end the previous line with two spaces

An empty line also makes you go on to the next line but leaves a gap

To create a line like below do three underscores ___
___
~~~

**Output:**
# Heading1
## Heading2
### Heading3
**bold text**  
*italicized text*
> blockquote

For normal text just type but  
to go on to next line end the previous line with two spaces

An empty line also makes you go on to the next line but leaves a gap

To create a line like below do three underscores ___
___

## 2. Lists

**Input:**
~~~md
*Numbered list*
1. First item
2. Second item
3. Third item

*Unordered list*
- First item
- Second item
- Third item

*Sub point*
- Main point
    - Tab twice before dash
    - for sub point
~~~

**Output:**

*Numbered list*
1. First item
2. Second item
3. Third item

*Unordered list*
- First item
- Second item
- Third item

*Sub point*
- Main point
    - Tab twice before dash
    - for sub point
___

## 3. Tables

**Input:**
~~~md
Head 1 | Head 2
------ | -------
cell 1 | cell 2
cell 3 | cell 4
~~~

**Output:**
Head 1 | Head 2
------ | -------
cell 1 | cell 2
cell 3 | cell 4
___

## 4. Local archives
When this lab was created by tutors build, a folder called archives was created within the lab folder and this is where you store any .zip folders you want to use within this lab. When the users presses the link the .zip folder is downloaded to their device. To use the .zip folders in your lab, follow the syntax in the input box below: 

**Input:**  
~~~md
[Archive link](archiveS/example.zip)
~~~
**Denotes use of relevant image file extension can be png, jpg, jpeg or gif*

**Output:**

[Archive link](archives/example.zip)
___

## 5. Local images
When this lab was created by tutors build, a folder called img was created within the lab folder and this is where you store any local images you want to use within this lab. To use the images in your lab, follow the syntax in the input box below: 

**Input:**  
~~~md
*Without alt text*
![](img/main.*)
*With alt text*
![This is the main lab image](img/example.*)
~~~
**Denotes use of relevant image file extension can be png, jpg, jpeg or gif*

**Output:**

*Without alt text*
![](img/example.png)
*With alt text*
![This is the main lab image](img/example.png)

**Important:**

We suggest you always add a description in the square brackets, this description is referred to as alt text and is shown should the image fail to load.

*Without alt text if image fails to load nothing is shown, just a blank space:*
![](img/01.*)

*With alt text if image fails to load the description from the square brackets is shown:*
![This is the main lab image](img/01.*)
___

## 6. Web images
Web images follow the same syntax as local images but link to web address images rather than the local img folder. 

**Input:**  
~~~md
![This is an image of octocat](https://octodex.github.com/images/Professortocat_v2.png)
~~~

**Output:**
![This is an image of octocat](https://octodex.github.com/images/Professortocat_v2.png)
___

## 7. Web links

**Input:**  
~~~md
*Direct link*
<http://github.com>

*With link text*
[GitHub](http://github.com)
~~~

**Output:**

*Direct link*  
<http://github.com>

*With link text*  
[GitHub](http://github.com)
___

## 8. Code snippets
To add code snippets to your lab simply type
~~~ followed by the coding language. Write you code and close the block with ~~~.  
Sorry we could not show closing ~~~ in snippets below as we are using the feature to show the feature so it would have closed my example. :joy:



**Input:**
~~~md
~~~javascript
const example = "example"
~~~
~~~md
~~~python
example = "example"
~~~
~~~md
~~~html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="mystyle.css" />
  </head>
  <body>
    <p>This is a paragraph.</p>
  </body>
</html>
~~~
~~~md
~~~asciimath
E=mc^2
~~~
~~~md
~~~latex

x=\frac{ -b\pm\sqrt{ b^2-4ac } } {2a}

\sum_{i=1}^n i^3 = \left( \frac{n(g(n)+1)} 2 \right) ^2

c = \pm\sqrt{a^2 + b^2}
~~~

**Output:**

~~~javascript
const example = "example"
~~~
~~~python
example = "example"
~~~
~~~html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="mystyle.css" />
  </head>
  <body>
    <p>This is a paragraph.</p>
  </body>
</html>
~~~
~~~asciimath
E=mc^2
~~~
~~~latex

x=\frac{ -b\pm\sqrt{ b^2-4ac } } {2a}

\sum_{i=1}^n i^3 = \left( \frac{n(g(n)+1)} 2 \right) ^2

c = \pm\sqrt{a^2 + b^2}
~~~
___