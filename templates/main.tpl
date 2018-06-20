<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <!-- Latest compiled and minified JavaScript -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
    <style>
        .table-responsive {
            min-height: .01%;
            overflow-x: auto;
        }

        .embed-responsive {
            height: calc(100vh - 64px)!important;
        }
        .navbar-nav li.active a {
            background: rgba(0, 0, 0, .1);
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
        <div class="col-md-12" style="padding: 0">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">

                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <a class="navbar-brand" href="#" onclick="main_jumbo()">
                    Two Wings
                </a>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="navbar-nav">
                        {% for _day in unique_days %}
{#                            <li class="nav-item">#}
{#                                <a class="nav-link" href="#" id="jb" onclick="main_jumbo()">Two Wings</a>#}
{#                            </li>#}
                            <li class="nav-item">
                                <a class="nav-link" href="#" id="{{ _day[0] }}" onclick="reply_click(this.id)">{{_day[1]}}</a>
                            </li>
                        {% endfor %}
                        <li class="nav-item">
                            <a class="nav-link" href="#" id="timeStamp"><b>Updated:</b> {{timeStamp}}</a>
                        </li>

                    </ul>
                    <ul class="navbar-nav ml-md-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="#">Link <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown">Detailed daily view</a>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                                {% for _day in unique_days %}
                                    <a class="dropdown-item" href="#" id="{{ _day[0] }}_drop" onclick="set_drop_menu(this.id)">{{_day[1]}}</a>
                                {% endfor %}
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
{#            <div class="resp-container">#}
{#                <iframe class="resp-iframe" src="jumbo.tpl" frameborder="0" allowfullscreen></iframe>#}
{#            </div>#}
            <!-- 16:9 aspect ratio -->
            <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="/jumbo" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    </div>
</div>
<script>
    const iframe = document.querySelector('iframe');
    function main_jumbo() {
        iframe.src = '/jumbo';
    }
    function reply_click(_id)
    {

        iframe.src = '/day/' + _id;
    }
    function set_drop_menu(_idx) {
        var p_idx = _idx.replace('_drop','');
        iframe.src = '/day/' + p_idx;
    }

</script>
</body>
</html>
