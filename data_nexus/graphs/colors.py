base_colors = [
        'rgb(31, 119, 180)', 'rgb(255, 127, 14)', 'rgb(44, 160, 44)', 'rgb(214, 39, 40)', 
        'rgb(148, 103, 189)', 'rgb(140, 86, 75)', 'rgb(227, 119, 194)', 'rgb(127, 127, 127)', 
        'rgb(188, 189, 34)', 'rgb(23, 190, 207)', 'rgb(174, 199, 232)', 'rgb(255, 187, 120)',
        'rgb(152, 223, 138)', 'rgb(255, 152, 150)', 'rgb(197, 176, 213)', 'rgb(196, 156, 148)',
        'rgb(247, 182, 210)', 'rgb(199, 199, 199)', 'rgb(219, 219, 141)', 'rgb(158, 218, 229)'
]



def color_for(index):
    if index < len(base_colors):
        return base_colors[index]
    else:
        r = (index * 137) % 256
        g = (index * 149) % 256
        b = (index * 163) % 256
        # Convertendo para o formato RGB
        color = f'rgb({r}, {g}, {b})'
        return color