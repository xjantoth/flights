<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <!-- Latest compiled and minified JavaScript -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <style>
        .table-responsive {
            min-height: .01%;
            overflow-x: auto;
        }
    </style>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Montserrat|Russo+One" rel="stylesheet">
    <!--
    font-family: 'Russo One', sans-serif;
    font-family: 'Montserrat', sans-serif;
    -->
    <title></title>
</head>
<body>

<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">

                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="navbar-toggler-icon"></span>
                </button> <a class="navbar-brand" href="#" onclick="main_jumbo()">Two Wings</a>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="navbar-nav">
                        {% for _day in unique_days %}
                            <li class="nav-item">
                                <a class="nav-link" href="#" id="{{ _day }}" onclick="reply_click(this.id)">{{_day}}</a>
                            </li>
                        {% endfor %}
                        <li class="nav-item">
                            <a class="nav-link" href="#" id="timeStamp">{{timeStamp}}</a>
                        </li>

                    </ul>
                    <ul class="navbar-nav ml-md-auto">
                        <li class="nav-item active">
                            <a class="nav-link" href="#">Link <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown">Detailed daily view</a>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                                {% for _day in unique_days %}
                                    <a class="dropdown-item" href="#" id="{{ _day }}_drop" onclick="set_drop_menu(this.id)">{{_day}}</a>
                                {% endfor %}
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
{#            <div class="resp-container">#}
{#                <iframe class="resp-iframe" src="jumbo.html" frameborder="0" allowfullscreen></iframe>#}
{#            </div>#}
            <!-- 16:9 aspect ratio -->
            <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="jumbo.html" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    </div>
</div>
<script>
    const iframe = document.querySelector('iframe');
    function main_jumbo() {
        iframe.src = 'jumbo.html';
    }
    function reply_click(_id)
    {

        iframe.src = _id + '.html';
    }
    function set_drop_menu(_idx) {
        var p_idx = _idx.replace('_drop','');
        iframe.src = p_idx + '.html';
    }

</script>
</body>
</html>
